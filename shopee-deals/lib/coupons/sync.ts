import "server-only";
import { eq, inArray, isNotNull, and, sql } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { getDatabase } from "@/lib/db";
import {
  campaignBanners,
  couponDeals,
  syncLogs,
  type NewCampaignBanner,
  type NewCouponDeal,
} from "@/lib/db/schema";
import { SITE, merchantLabel } from "@/lib/site";
import { truncateVi } from "@/lib/utils";
import {
  coerceCategory as coerceOfferCategory,
  pickCategorySlug,
} from "@/lib/categories";
import {
  createTiktokLink,
  extractCode,
  fetchDatafeeds,
  fetchOffers,
  hasAccessKey,
  parseAtDate,
  searchTiktokProducts,
  type ATDatafeedProduct,
  type ATOffer,
  type TiktokProduct,
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
const DATAFEED_PAGE_SIZE = 50;
const TIKTOK_MAX_PAGES = 1; // no pagination by default — keep runs predictable

/** Log message prefixes so admin logs tell the four pipelines apart. */
const PREFIXES = {
  offers: "shopee offers",
  datafeeds: "datafeeds (lazada/tiki)",
  tiktok: "tiktok shop",
  banners: "campaign banners",
} as const;

function prefixed(prefix: string, message: string | null): string {
  return message ? `${prefix}: ${message}` : prefix;
}

function envList(name: string, fallback: string[]): string[] {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const items = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : fallback;
}

function envInt(name: string, fallback: number, min: number, max: number): number {
  const raw = process.env[name]?.trim();
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isNaN(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function numOrNull(value: unknown): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : null;
}

/** Feed `desc` fields carry HTML — render as plain short text or drop. */
function cleanFeedText(value: string | undefined, max = 240): string | null {
  if (!value) return null;
  const text = value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;
  return truncateVi(text, max);
}

/** "tiki.vn" → "tiki", "lazada.vn" → "lazada", unknown → stripped slug. */
function merchantForDomain(domain: string | undefined): string {
  const d = (domain ?? "").trim().toLowerCase();
  if (!d) return SITE.targetMerchants[0];
  return d.replace(/^www\./, "").replace(/\.vn$/, "");
}

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
    categories: pickCategorySlug(
      (offer.categories ?? [])
        .map(coerceOfferCategory)
        .filter((c): c is string => Boolean(c)),
      offer.name,
    ),
    startTime: parseAtDate(offer.start_time, false),
    endTime: parseAtDate(offer.end_time, true),
    updatedAt: new Date(),
  };
}

/**
 * Product feeds: `price` holds the current selling price (AT exposes the sale
 * price in `discount`, the original in `price`), `discountRate` the feed's
 * rate. No promo codes exist for these products (code stays null).
 */
function mapDatafeedToRow(product: ATDatafeedProduct): Omit<NewCouponDeal, "id"> {
  const merchant = merchantForDomain(product.domain);
  const campaign = product.campaign?.trim() || product.domain || "feed";
  const sku = product.sku.trim() || product.product_id;
  const sale = product.discount != null && product.discount > 0 ? product.discount : product.price;
  const price = sale != null && sale > 0 ? sale : null;
  const discountRate =
    product.discount_rate != null && product.discount_rate > 0 ? product.discount_rate : null;
  return {
    source: "accesstrade",
    externalId: `${campaign}:${sku}`,
    merchant,
    merchantName: merchantLabel(merchant) || product.merchant || campaign,
    domain: product.domain ?? null,
    code: null,
    title: product.name.trim(),
    content: cleanFeedText(product.desc),
    image: product.image ?? null,
    affLink: product.aff_link,
    link: product.url ?? null,
    categories: pickCategorySlug(product.cate, product.name),
    price,
    discountRate,
    startTime: null,
    endTime: null,
    updatedAt: new Date(),
  };
}

/** TikTok Shop rows: no codes, price from sales range minimum. */
function mapTiktokToRow(product: TiktokProduct): Omit<NewCouponDeal, "id"> {
  const salesMin = numOrNull(product.sales_price?.minimum_amount);
  const origMax = numOrNull(product.original_price?.maximum_amount);
  const price = salesMin != null && salesMin > 0 ? salesMin : null;
  const discountRate =
    price != null && origMax != null && origMax > price
      ? Math.round((1 - price / origMax) * 10000) / 10000
      : null;
  const chainNames = (product.category_chains ?? [])
    .map((c) => c.local_name?.trim())
    .filter((n): n is string => Boolean(n));
  return {
    source: "tiktok",
    externalId: product.id,
    merchant: "tiktokshop",
    merchantName: merchantLabel("tiktokshop"),
    domain: "shop.tiktok.com",
    code: null,
    title: product.title.trim(),
    content: null,
    image: product.main_image_url ?? null,
    // Placeholder — replaced by the minted affiliate link for new rows.
    affLink: product.detail_link,
    link: product.detail_link,
    categories: pickCategorySlug(chainNames, product.title),
    price,
    discountRate,
    startTime: null,
    endTime: null,
    updatedAt: new Date(),
  };
}

type DealSource = (typeof couponDeals.$inferSelect)["source"];

/**
 * Columns synced from feeds. Multi-row .values() requires a uniform column
 * set across every row, so callers' rows are normalized to exactly these.
 */
const UPSERT_COLUMNS = [
  "source",
  "externalId",
  "merchant",
  "merchantName",
  "domain",
  "code",
  "title",
  "content",
  "image",
  "price",
  "discountRate",
  "affLink",
  "link",
  "categories",
  "startTime",
  "endTime",
] as const;

/**
 * Batch upsert scoped by source ((source, externalId) is the unique key) —
 * ONE multi-row INSERT ... ON CONFLICT DO UPDATE instead of a per-row loop.
 * 600 sequential single-row statements against Neon took ~5 minutes and blew
 * past the 300 s Fluid function cap, so every cron run died in a 504 after
 * finishing only the offers pipeline. Deterministic created/updated stats
 * (via xmax) and preserved manual flags (isActive/isFeatured) on resync.
 */
async function upsertAll(_source: DealSource, rows: Array<Omit<NewCouponDeal, "id">>) {
  if (rows.length === 0) {
    return { created: 0, updated: 0, keptIds: [] as string[] };
  }
  const db = await getDatabase();
  // A single fetch can return the same voucher twice (overlapping campaign
  // pages); two colliding rows inside one statement would still violate the
  // (source, external_id) unique index, so dedupe locally first. Keep the
  // first occurrence.
  const seenExternal = new Set<string>();
  const deduped = rows.filter((row) => {
    if (!row.externalId) return true;
    if (seenExternal.has(row.externalId)) return false;
    seenExternal.add(row.externalId);
    return true;
  });
  const values = deduped.map((row) => {
    const out = {} as Omit<NewCouponDeal, "id">;
    for (const col of UPSERT_COLUMNS) {
      (out as Record<string, unknown>)[col] =
        (row as Record<string, unknown>)[col] ?? null;
    }
    return out;
  });

  // xmax = 0 ⇒ the row was newly inserted by this statement (not updated).
  const returned = await db
    .insert(couponDeals)
    .values(values)
    .onConflictDoUpdate({
      target: [couponDeals.source, couponDeals.externalId],
      // Syncable fields only — manual curation flags stay untouched.
      set: {
        externalId: sql`excluded.external_id`,
        merchant: sql`excluded.merchant`,
        merchantName: sql`excluded.merchant_name`,
        domain: sql`excluded.domain`,
        code: sql`excluded.code`,
        title: sql`excluded.title`,
        content: sql`excluded.content`,
        image: sql`excluded.image`,
        price: sql`excluded.price`,
        discountRate: sql`excluded.discount_rate`,
        affLink: sql`excluded.aff_link`,
        link: sql`excluded.link`,
        categories: sql`excluded.categories`,
        startTime: sql`excluded.start_time`,
        endTime: sql`excluded.end_time`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: couponDeals.id, inserted: sql<string>`xmax::text` });

  let created = 0;
  for (const r of returned) if (r.inserted === "0") created += 1;

  return {
    created,
    updated: returned.length - created,
    keptIds: returned.map((r) => r.id),
  };
}

/**
 * TikTok products need a freshly minted affiliate link per new row, so the
 * upsert differs from the generic one: existing rows never get live-recreated
 * links (the stored one is kept), updates only refresh drift-prone fields.
 */
async function upsertTiktokRows(
  products: TiktokProduct[],
  warnings: string[],
) {
  const db = await getDatabase();
  const ids = Array.from(new Set(products.map((p) => p.id)));
  const existing = ids.length
    ? await db
        .select({ id: couponDeals.id, externalId: couponDeals.externalId })
        .from(couponDeals)
        .where(and(eq(couponDeals.source, "tiktok"), inArray(couponDeals.externalId, ids)))
    : [];
  const existingIdByExternal = new Map(
    existing.map((e) => [e.externalId, e.id] as const),
  );

  let created = 0;
  let updated = 0;
  let linkFailures = 0;
  let linkCalls = 0;
  const keptIds: string[] = [];

  for (const product of products) {
    const existingId = existingIdByExternal.get(product.id);
    if (existingId) {
      const base = mapTiktokToRow(product);
      await db
        .update(couponDeals)
        .set({
          title: base.title,
          image: base.image,
          price: base.price,
          discountRate: base.discountRate,
          link: base.link,
          categories: base.categories,
          // Search rotation moves products in/out of result pages — a product
          // surfacing again in the feed is live, so re-activate it.
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(couponDeals.id, existingId));
      updated += 1;
      keptIds.push(existingId);
      continue;
    }

    // New product → mint an affiliate link (minify=true keeps it fast).
    // Space calls out to stay under the API's burst rate limit.
    if (linkCalls > 0) {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    linkCalls += 1;
    let affLink: string | null = null;
    try {
      affLink = await createTiktokLink(product.detail_link);
    } catch (error) {
      warnings.push(`create_link ${product.id}: ${errorMessage(error)}`);
      linkFailures += 1;
      continue;
    }
    if (!affLink) {
      // No monetizable link (product not in the campaign) → skip; the next
      // run retries this row before it ever reaches the storefront.
      warnings.push(`create_link ${product.id}: no campaign link, skipped`);
      linkFailures += 1;
      continue;
    }
    const row = mapTiktokToRow(product);
    row.affLink = affLink;
    const inserted = await db
      .insert(couponDeals)
      .values(row)
      .returning({ id: couponDeals.id });
    created += 1;
    if (inserted[0]) keptIds.push(inserted[0].id);
  }

  return { created, updated, keptIds, linkFailures };
}

/**
 * Rows that no longer appear in results are abandoned: keep rows for history
 * and click stats, but stop showing them (isActive = false). Scoped by source
 * AND merchant slugs — the AT "accesstrade" source holds both Shopee coupon
 * offers and Tiki/Lazada product feeds, so the merchant column separates them.
 */
async function disableNotIn(
  source: DealSource,
  merchantSlugs: string[],
  keptIds: string[],
): Promise<number> {
  if (keptIds.length === 0 || merchantSlugs.length === 0) return 0;
  const db = await getDatabase();
  const all = await db
    .select({ id: couponDeals.id, merchant: couponDeals.merchant })
    .from(couponDeals)
    .where(and(eq(couponDeals.source, source), isNotNull(couponDeals.externalId)));
  const gone = all.filter(
    (r) => merchantSlugs.includes(r.merchant) && !keptIds.includes(r.id),
  );
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

async function openSyncLog(trigger: SyncTrigger): Promise<string | null> {
  const db = await getDatabase();
  const initial = await db
    .insert(syncLogs)
    .values({
      trigger,
      status: "error",
      startedAt: new Date(),
      message: "running…",
    })
    .returning({ id: syncLogs.id });
  return initial[0]?.id ?? null;
}

async function updateLog(
  logId: string | null,
  trigger: SyncTrigger,
  status: "success" | "error",
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

/** Shared pipeline skeleton: open log → run → close log. Never throws. */
async function runPipeline(
  trigger: SyncTrigger,
  prefix: string,
  work: (context: {
    counts: { fetched: number; created: number; updated: number; disabled: number };
    warnings: string[];
  }) => Promise<void>,
): Promise<SyncResult> {
  const logId = await openSyncLog(trigger);
  const counts = { fetched: 0, created: 0, updated: 0, disabled: 0 };
  const warnings: string[] = [];
  try {
    if (!hasAccessKey()) {
      throw new Error(
        "ACCESSTRADE_ACCESS_KEY chưa cấu hình — thêm access key vào biến môi trường để đồng bộ dữ liệu từ Accesstrade.",
      );
    }
    await work({ counts, warnings });
    invalidateCaches();
    const message = warnings.length > 0 ? warnings.join(" | ") : null;
    const prefixedMessage = prefixed(prefix, message);
    await updateLog(logId, trigger, "success", counts, prefixedMessage);
    return { status: "success", ...counts, message: prefixedMessage };
  } catch (error) {
    const prefixedMessage = prefixed(prefix, errorMessage(error));
    await updateLog(logId, trigger, "error", counts, prefixedMessage);
    return { status: "error", ...counts, message: prefixedMessage };
  }
}

/**
 * Pipeline 1 — Shopee promo-code offers (GET /v1/offers_informations).
 * Never throws — every failure lands in sync_logs because cron callers
 * cannot see exceptions.
 */
export async function syncAccesstrade(trigger: SyncTrigger): Promise<SyncResult> {
  return runPipeline(trigger, PREFIXES.offers, async ({ counts, warnings }) => {
    const result = await fetchOffers({
      merchants: [...SITE.targetMerchants],
      withCoupon: "all",
      onlyActive: true,
      pageSize: PAGE_SIZE,
      maxPages: MAX_PAGES,
    });
    counts.fetched = result.fetchedCount;
    warnings.push(...result.warnings);

    const rows = result.offers.map(mapOfferToRow);
    const up = await upsertAll("accesstrade", rows);
    counts.created = up.created;
    counts.updated = up.updated;
    counts.disabled = await disableNotIn("accesstrade", ["shopee"], up.keptIds);
  });
}

/**
 * Pipeline 2 — Tiki/Lazada product deals (GET /v1/datafeeds, per domain).
 * Rows carry their own affiliate link, keyed by `<campaign>:<sku>`.
 */
export async function syncDatafeeds(trigger: SyncTrigger): Promise<SyncResult> {
  return runPipeline(trigger, PREFIXES.datafeeds, async ({ counts, warnings }) => {
    const domains = envList("ACCESSTRADE_DATAFEED_DOMAINS", ["lazada.vn", "tiki.vn"]);
    const pages = envInt("ACCESSTRADE_DATAFEED_PAGES", 2, 1, 10);

    const result = await fetchDatafeeds({
      domains,
      pageSize: DATAFEED_PAGE_SIZE,
      maxPages: pages,
    });
    counts.fetched = result.fetchedCount;
    warnings.push(...result.warnings);

    const rows = result.products.map(mapDatafeedToRow);
    const up = await upsertAll("accesstrade", rows);
    counts.created = up.created;
    counts.updated = up.updated;
    // Only this run's domain slugs stay active, so Tiki/Lazada rows can be
    // retired independently of Shopee offers sharing the same source.
    const campaigns = domains.map(merchantForDomain);
    counts.disabled = await disableNotIn("accesstrade", campaigns, up.keptIds);
  });
}

/**
 * Pipeline 3 — TikTok Shop product deals (search v2 + minted aff links).
 * Keyword-driven feed: each configured keyword contributes `limit` products.
 */
export async function syncTiktokProducts(trigger: SyncTrigger): Promise<SyncResult> {
  return runPipeline(trigger, PREFIXES.tiktok, async ({ counts, warnings }) => {
    const keywords = envList("ACCESSTRADE_TIKTOK_KEYWORDS", ["quần", "áo", "giày", "mỹ phẩm"]);
    const limit = envInt("ACCESSTRADE_TIKTOK_LIMIT", 10, 1, 50);

    const byId = new Map<string, TiktokProduct>();
    for (const keyword of keywords) {
      let token: string | null = null;
      for (let page = 1; page <= TIKTOK_MAX_PAGES; page++) {
        try {
          const res = await searchTiktokProducts(keyword, limit, token);
          for (const product of res.products) byId.set(product.id, product);
          token = res.nextPageToken;
          if (!token) break;
        } catch (error) {
          warnings.push(`search "${keyword}": ${errorMessage(error)}`);
          break;
        }
      }
    }
    counts.fetched = byId.size;

    const products = Array.from(byId.values());
    if (products.length === 0) return;

    const up = await upsertTiktokRows(products, warnings);
    counts.created = up.created;
    counts.updated = up.updated;
    if (up.linkFailures > 0) {
      warnings.push(`link skipped/failing: ${up.linkFailures}`);
    }
    // No auto-disable here: search rotation reshuffles result pages between
    // runs, so absence from one snapshot is not proof of delisting (rows are
    // re-activated whenever they resurface instead).
  });
}

/** Pipeline 4 — campaign banner creatives from the pub2 publisher API. */
const PUB2_API_BASE = "https://pub2-api.accesstrade.vn";

/** merchant slug → pub2 campaign search keyword (tiktokshop has no creatives — skipped). */
const BANNER_CAMPAIGNS: Array<{ merchant: string; keyword: string }> = [
  { merchant: "shopee", keyword: "Shopee" },
  { merchant: "tiki", keyword: "TIKI" },
  { merchant: "lazada", keyword: "Lazada" },
  { merchant: "cellphones", keyword: "CellphoneS" },
  { merchant: "concung", keyword: "Con Cưng" },
  { merchant: "highlands", keyword: "Highlands" },
  { merchant: "oneat", keyword: "ACCESSTRADE" },
];

type Pub2CampaignHit = {
  campaign_id?: string | number;
  job_id?: string | number;
  logo?: string;
  name?: string;
};

/** pub2 wraps list endpoints as { data: [...], success } — accept both shapes. */
type Pub2SearchResponse = { data?: Pub2CampaignHit[] };

type Pub2Attachment = {
  id?: number;
  attachment_title?: string;
  attachment_type?: number;
  attachment_url?: string;
};

type Pub2CampaignDetail = {
  data?: {
    name?: string;
    adv_default_link?: string[];
    default_img_url?: string;
    attachments?: Pub2Attachment[];
  };
};

async function pub2Fetch(path: string, jwt: string): Promise<unknown> {
  const res = await fetch(`${PUB2_API_BASE}${path}`, {
    headers: { authorization: `Bearer ${jwt}`, accept: "application/json" },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    const body = (await res.text().catch(() => "")).slice(0, 200);
    throw new Error(
      `pub2 ${path} → HTTP ${res.status} — JWT bị từ chối (body: ${body || "trống"}). Kiểm tra AT_PUB2_JWT hoặc IP serverless bị chặn.`,
    );
  }
  if (!res.ok) throw new Error(`pub2 ${path} → HTTP ${res.status}`);
  return res.json();
}

/** Upsert banner rows keyed by (source, imageUrl); counts created vs updated. */
async function upsertBanners(rows: Array<Omit<NewCampaignBanner, "id">>) {
  const db = await getDatabase();
  const urls = rows.map((row) => row.imageUrl);
  const existing = urls.length
    ? await db
        .select({ id: campaignBanners.id, imageUrl: campaignBanners.imageUrl })
        .from(campaignBanners)
        .where(
          and(
            eq(campaignBanners.source, "accesstrade"),
            inArray(campaignBanners.imageUrl, urls),
          ),
        )
    : [];
  const existingIdByUrl = new Map(
    existing.map((row) => [row.imageUrl, row.id] as const),
  );
  let created = 0;
  let updated = 0;
  for (const row of rows) {
    const id = existingIdByUrl.get(row.imageUrl);
    if (id) {
      await db
        .update(campaignBanners)
        .set({ ...row, updatedAt: new Date() })
        .where(eq(campaignBanners.id, id));
      updated += 1;
    } else {
      await db.insert(campaignBanners).values(row);
      created += 1;
    }
  }
  return { created, updated };
}

/**
 * Pulls banner/logo attachments for each approved pub2 campaign. Best-effort:
 * an expired/missing JWT logs a warning and keeps existing banners on the site
 * instead of failing the whole sync report.
 */
export async function syncCampaignBanners(
  trigger: SyncTrigger,
): Promise<SyncResult> {
  return runPipeline(trigger, PREFIXES.banners, async ({ counts, warnings }) => {
    const jwt = process.env.AT_PUB2_JWT?.trim();
    if (!jwt) {
      warnings.push(
        "AT_PUB2_JWT chưa cấu hình — banner camp bỏ qua (thêm JWT vào env để đồng bộ banner).",
      );
      return;
    }
    const all: Array<Omit<NewCampaignBanner, "id">> = [];
    for (const [index, { merchant, keyword }] of BANNER_CAMPAIGNS.entries()) {
      const search = (await pub2Fetch(
        `/v2/campaign/search?name=${encodeURIComponent(keyword)}`,
        jwt,
      )) as Pub2SearchResponse | Pub2CampaignHit[];
      const hits = Array.isArray(search)
        ? search
        : Array.isArray(search.data)
          ? search.data
          : [];
      const hit =
        hits.find((camp) =>
          (camp.name ?? "").toLowerCase().includes(keyword.toLowerCase()),
        ) ?? hits[0];
      if (!hit?.campaign_id) {
        warnings.push(`${merchant}: không tìm thấy camp trên pub2`);
        continue;
      }
      const detail = (await pub2Fetch(
        `/v2/campaign/${hit.campaign_id}`,
        jwt,
      )) as Pub2CampaignDetail;
      const data = detail.data ?? {};
      const attachments = data.attachments ?? [];
      const linkUrl =
        data.adv_default_link?.[0] ?? `/tim-kiem?merchant=${merchant}`;
      const mapped = attachments
        .filter((attachment) => Boolean(attachment.attachment_url))
        .map((attachment) => ({
          source: "accesstrade" as const,
          merchant,
          campaignId: String(hit.campaign_id),
          title:
            attachment.attachment_title || data.name || merchantLabel(merchant),
          imageUrl: attachment.attachment_url as string,
          linkUrl,
          kind: (attachment.attachment_type === 2
            ? "logo"
            : "banner") as "banner" | "logo",
          isActive: true,
          sortOrder: index * 10,
          updatedAt: new Date(),
        }));
      counts.fetched += attachments.length;
      all.push(...mapped);
    }
    if (all.length === 0) return;
    const up = await upsertBanners(all);
    counts.created = up.created;
    counts.updated = up.updated;
  });
}

export type SyncPipeline = "shopee-offers" | "datafeeds" | "tiktok" | "banners";

export type SyncReport = {
  status: "success" | "error";
  okCount: number;
  pipelines: Record<SyncPipeline | string, SyncResult>;
};

/**
 * Runs the four pipelines sequentially (each with its own sync_logs row).
 * Overall status succeeds when at least one pipeline works; a total outage
 * surfaces as error. Sequential keeps API/DB pressure predictable.
 */
export async function syncAll(trigger: SyncTrigger): Promise<SyncReport> {
  const pipelines: Record<SyncPipeline | string, SyncResult> = {
    "shopee-offers": await syncAccesstrade(trigger),
    datafeeds: await syncDatafeeds(trigger),
    tiktok: await syncTiktokProducts(trigger),
    banners: await syncCampaignBanners(trigger),
  };
  const okCount = Object.values(pipelines).filter((r) => r.status === "success").length;
  return { status: okCount > 0 ? "success" : "error", okCount, pipelines };
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
