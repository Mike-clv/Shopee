import "server-only";
import { and, asc, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { couponDeals, type CouponDeal } from "@/lib/db/schema";
import { cacheLife, cacheTag } from "next/cache";
import { SITE } from "@/lib/site";

export type DealList = CouponDeal[];

function activeWhere(merchant?: string) {
  const activeExpr = eq(couponDeals.isActive, true);
  const notEnded = or(isNull(couponDeals.endTime), sql`${couponDeals.endTime} > now()`);
  const merchantExpr = merchant ? eq(couponDeals.merchant, merchant) : undefined;
  return and(activeExpr, notEnded, merchantExpr);
}

/** Newest first, featured pinned on top. Tagged so cron sync can invalidate. */
export async function listActiveDeals(limit = 24): Promise<DealList> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  return db
    .select()
    .from(couponDeals)
    .where(activeWhere(SITE.targetMerchants[0]))
    .orderBy(desc(couponDeals.isFeatured), desc(couponDeals.createdAt))
    .limit(limit);
}

export async function listFeaturedDeals(limit = 8): Promise<DealList> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  return db
    .select()
    .from(couponDeals)
    .where(activeWhere(SITE.targetMerchants[0]))
    .orderBy(desc(couponDeals.clickCount), desc(couponDeals.updatedAt))
    .limit(limit);
}

export async function searchDeals(query: string, limit = 30): Promise<DealList> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const needle = `%${query.trim()}%`;
  return db
    .select()
    .from(couponDeals)
    .where(
      and(
        activeWhere(),
        or(
          ilike(couponDeals.title, needle),
          ilike(couponDeals.content, needle),
          ilike(couponDeals.code, needle),
        ),
      ),
    )
    .orderBy(desc(couponDeals.isFeatured), desc(couponDeals.createdAt))
    .limit(limit);
}

export async function getDealCached(id: string): Promise<CouponDeal | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select()
    .from(couponDeals)
    .where(eq(couponDeals.id, id))
    .limit(1);
  return rows[0] ?? null;
}

/** Admin tables are always fresh — no cache here (behind auth session anyway). */
export async function listAllDealsRaw(limit = 200): Promise<DealList> {
  const db = await getDatabase();
  return db
    .select()
    .from(couponDeals)
    .orderBy(asc(couponDeals.isActive), desc(couponDeals.updatedAt))
    .limit(limit);
}

/**
 * Request-time rating lookup for /go/[id] — must NOT be cached so a disabled
 * or expired coupon stops redirecting the instant it is turned off.
 */
export async function getActiveDealByIdUncached(
  id: string,
): Promise<CouponDeal | null> {
  const db = await getDatabase();
  const rows = await db
    .select()
    .from(couponDeals)
    .where(and(eq(couponDeals.id, id), sql`${couponDeals.isActive} = true`))
    .limit(1);
  return rows[0] ?? null;
}

/** Counts for the homepage stat strip (cached like the rest of the data). */
export async function countActiveDeals(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(couponDeals)
    .where(and(activeWhere(), eq(couponDeals.merchant, SITE.targetMerchants[0])));
  return rows[0]?.count ?? 0;
}
