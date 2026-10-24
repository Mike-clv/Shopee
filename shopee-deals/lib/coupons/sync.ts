import "server-only";
import { eq, inArray, isNotNull, and, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getDatabase } from "@/lib/db";
import { couponDeals, syncLogs, type NewCouponDeal } from "@/lib/db/schema";
import { SITE } from "@/lib/site";
import {
  extractCode,
  fetchOffers,
  hasAccessKey,
  parseAtDate,
  type ATOffer,
} from "@/lib/accesstrade/client";

export type SyncTrigger = "cron" | "manual";
export type SyncResult = {
  status: "success" | "error";
  fetched: number;
  created: number;
  updated: number;
  disabled: number;
  message: string | null;
};

const PAGE_SIZE = 50;
const MAX_PAGES = 12;

function mapOfferToRow(offer: ATOffer): Omit<NewCouponDeal, "id"> {
  const code = extractCode(offer);
  return {
    source: "accesstrade",
    externalId: offer.id,
    merchant: offer.merchant || SITE.targetMerchants[0],
    merchantName: offer.merchant,
    domain: offer.domain ?? null,
    code,
    title: offer.name.trim(),
    content: offer.content?.trim() ?? null,
    image: offer.image ?? null,
    affLink: offer.aff_link,
    link: offer.link ?? null,
    categories: offer.categories?.map(String) ?? [],
    startTime: parseAtDate(offer.start_time, false),
    endTime: parseAtDate(offer.end_time, true),
    updatedAt: new Date(),
  };
}

/**
 * Row-by-row upsert. Deterministic created/updated stats and preserved
 * manual flags (isActive/isFeatured) on resync. Volume is ≤ a few hundred
 * per run, so per-row performance is not a concern.
 */
async function upsertAll(rows: Array<Omit<NewCouponDeal, "id">>) {
  const db = await getDatabase();
  const externalIds = rows
    .map((r) => r.externalId)
    .filter((v): v is string => v != null);

  const existing = externalIds.length
    ? await db
        .select({ id: couponDeals.id, externalId: couponDeals.externalId })
        .from(couponDeals)
        .where(inArray(couponDeals.externalId, externalIds))
    : [];
  const existingIdByExternal = new Map(
    existing.map((e) => [e.externalId, e.id] as const),
  );

  let created = 0;
  let updated = 0;
  const keptIds: string[] = [];

  for (const row of rows) {
    const existingId = row.externalId
      ? existingIdByExternal.get(row.externalId)
      : undefined;
    if (existingId) {
      // Syncable fields only — manual curation flags stay untouched.
      const { isActive: _isActive, isFeatured: _isFeatured, ...syncable } = row;
      void _isActive;
      void _isFeatured;
      await db
        .update(couponDeals)
        .set({ ...syncable, updatedAt: new Date() })
        .where(eq(couponDeals.id, existingId));
      updated += 1;
      keptIds.push(existingId);
    } else {
      const inserted = await db
        .insert(couponDeals)
        .values(row)
        .returning({ id: couponDeals.id });
      created += 1;
      if (inserted[0]) keptIds.push(inserted[0].id);
    }
  }

  return { created, updated, keptIds };
}

/**
 * Offers that no longer appear in AT results are abandoned: keep rows for
 * history and click stats, but stop showing them (isActive = false).
 */
async function disableNotIn(keptIds: string[]): Promise<number> {
  if (keptIds.length === 0) return 0;
  const db = await getDatabase();
  const all = await db
    .select({ id: couponDeals.id })
    .from(couponDeals)
    .where(and(eq(couponDeals.source, "accesstrade"), isNotNull(couponDeals.externalId)));
  const gone = all.filter((r) => !keptIds.includes(r.id));
  if (gone.length === 0) return 0;
  await db
    .update(couponDeals)
    .set({ isActive: false, updatedAt: new Date() })
    .where(inArray(couponDeals.id, gone.map((g) => g.id)));
  return gone.length;
}

function invalidateCaches() {
  // Longest stale-while-revalidate: coupon pages refresh in the background.
  // Route Handler (no Server Action available): expire immediately so the next
  // request blocking-revalidates with the fresh rows instead of serving stale.
  revalidateTag(SITE.couponsTag, { expire: 0 });
}

/**
 * Full sync pipeline. Never throws — every failure lands in sync_logs
 * because cron callers cannot see exceptions.
 */
export async function syncAccesstrade(trigger: SyncTrigger): Promise<SyncResult> {
  const db = await getDatabase();
  const started = new Date();
  const initial = await db
    .insert(syncLogs)
    .values({ trigger, status: "error", startedAt: started, message: "running…" })
    .returning({ id: syncLogs.id });
  const logId = initial[0]?.id ?? null;

  const counts = { fetched: 0, created: 0, updated: 0, disabled: 0 };

  try {
    if (!hasAccessKey()) {
      throw new Error(
        "ACCESSTRADE_ACCESS_KEY chưa cấu hình — thêm access key vào biến môi trường để lấy coupon thật từ Accesstrade.",
      );
    }

    const result = await fetchOffers({
      merchants: [...SITE.targetMerchants],
      withCoupon: "all",
      onlyActive: true,
      pageSize: PAGE_SIZE,
      maxPages: MAX_PAGES,
    });
    counts.fetched = result.fetchedCount;

    const rows = result.offers.map(mapOfferToRow);
    const up = await upsertAll(rows);
    counts.created = up.created;
    counts.updated = up.updated;
    counts.disabled = await disableNotIn(up.keptIds);

    invalidateCaches();

    const message = result.warnings.length > 0 ? result.warnings.join(" | ") : null;
    await updateLog(logId, trigger, "success", counts, message);
    return { status: "success", ...counts, message };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await updateLog(logId, trigger, "error", counts, message);
    return { status: "error", ...counts, message };
  }
}

type SyncStatusRow = "success" | "error";

async function updateLog(
  logId: string | null,
  trigger: SyncTrigger,
  status: SyncStatusRow,
  counts: { fetched: number; created: number; updated: number; disabled: number },
  message: string | null,
) {
  const db = await getDatabase();
  const values = {
    trigger,
    status: status,
    fetched: counts.fetched,
    created: counts.created,
    updated: counts.updated,
    disabled: counts.disabled,
    message,
    finishedAt: new Date(),
  };
  if (!logId) {
    await db.insert(syncLogs).values({ ...values, startedAt: new Date() });
    return;
  }
  await db.update(syncLogs).set(values).where(eq(syncLogs.id, logId));
}

/** Recent sync history for the admin dashboard. */
export async function listSyncLogs(limit = 10) {
  const db = await getDatabase();
  return db
    .select()
    .from(syncLogs)
    .orderBy(sql`${syncLogs.startedAt} desc`)
    .limit(limit);
}
