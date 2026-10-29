import "server-only";
import { and, asc, desc, eq, ilike, isNull, ne, or, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { campaignBanners, couponDeals, type CampaignBanner, type CouponDeal } from "@/lib/db/schema";
import { cacheLife, cacheTag } from "next/cache";
import { SITE } from "@/lib/site";

export type DealList = CouponDeal[];

/** Public sort options for the search page (`?sort=` values map onto these). */
export type SearchSort = "new" | "discount" | "price";

export type DealQuery = {
  merchant?: string;
  category?: string;
  limit?: number;
  page?: number; // 1-based; combined with limit produces the SQL offset
  offset?: number; // explicit offset overrides page when provided
};

function activeWhere(merchant?: string, category?: string) {
  const activeExpr = eq(couponDeals.isActive, true);
  const notEnded = or(isNull(couponDeals.endTime), sql`${couponDeals.endTime} > now()`);
  const merchantExpr = merchant ? eq(couponDeals.merchant, merchant) : undefined;
  // Array containment with an explicit cast so the bound param types cleanly.
  const categoryExpr = category
    ? sql`${couponDeals.categories} @> ARRAY[${category}]::text[]`
    : undefined;
  return and(activeExpr, notEnded, merchantExpr, categoryExpr);
}

function searchExpr(query: string) {
  const needle = `%${query.trim()}%`;
  return or(
    ilike(couponDeals.title, needle),
    ilike(couponDeals.content, needle),
    ilike(couponDeals.code, needle),
    // Empty query ("%%") must not depend on nullable code/content — match all.
    query.trim().length === 0 ? sql`true` : undefined,
  );
}

/** Newest first, featured pinned on top. Tagged so cron sync can invalidate. */
export async function listActiveDeals(options: DealQuery = {}): Promise<DealList> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const limit = options.limit ?? 24;
  const offset = options.offset ?? (options.page ? (options.page - 1) * limit : 0);
  return db
    .select()
    .from(couponDeals)
    .where(activeWhere(options.merchant, options.category))
    .orderBy(desc(couponDeals.isFeatured), desc(couponDeals.createdAt))
    .limit(limit)
    .offset(offset);
}

/** Search/browse with optional merchant + category filters (paged). */
export async function searchDeals(
  query: string,
  options?: DealQuery & { sort?: SearchSort },
): Promise<DealList> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const limit = options?.limit ?? 30;
  const offset =
    options?.offset ?? (options?.page ? (options.page - 1) * limit : 0);
  return db
    .select()
    .from(couponDeals)
    .where(
      and(
        activeWhere(options?.merchant, options?.category),
        searchExpr(query),
      ),
    )
    .orderBy(...orderClause(options?.sort))
    .limit(limit)
    .offset(offset);
}

/** Shared ordering for roster queries. Default = hot (featured pinned). */
function orderClause(sort?: SearchSort) {
  switch (sort) {
    case "new":
      return [desc(couponDeals.createdAt)];
    case "discount":
      return [sql`${couponDeals.discountRate} desc nulls last`, desc(couponDeals.createdAt)];
    case "price":
      return [sql`${couponDeals.price} asc nulls last`, desc(couponDeals.createdAt)];
    default:
      return [desc(couponDeals.isFeatured), desc(couponDeals.createdAt)];
  }
}

/** Total rows for a search — powers real "page x of y" pagination. */
export async function countSearchDeals(
  query: string,
  options?: DealQuery,
): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(couponDeals)
    .where(
      and(
        activeWhere(options?.merchant, options?.category),
        searchExpr(query),
      ),
    );
  return rows[0]?.count ?? 0;
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
    .where(activeWhere());
  return rows[0]?.count ?? 0;
}

/** Active deal count per merchant — powers section headers on home (cached). */export async function countDealsPerMerchant(): Promise<Record<string, number>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select({ merchant: couponDeals.merchant, count: sql<number>`count(*)::int` })
    .from(couponDeals)
    .where(activeWhere())
    .groupBy(couponDeals.merchant);
  const map: Record<string, number> = {};
  for (const r of rows) map[r.merchant] = r.count;
  return map;
}

/**
 * Top categories by active-deal count, optionally scoped to one merchant so
 * chip badges match what the combined filter will actually return. Computed
 * in JS from a categories-only projection (array de-normalization stays
 * compatible with both postgres and PGlite drivers without dialect-specific SQL).
 */
export async function listTopCategories(
  limit = 12,
  merchant?: string,
): Promise<Array<{ slug: string; count: number }>> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select({ categories: couponDeals.categories })
    .from(couponDeals)
    .where(activeWhere(merchant));
  const counts = new Map<string, number>();
  for (const row of rows) {
    for (const slug of row.categories ?? []) {
      if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
    .slice(0, limit);
}

/**
 * Admin stats across every source/merchant — uncached (admin only page).
 * total/active differ from the list view which caps at `limit`.
 */
export async function countDealsRaw(): Promise<{ total: number; active: number }> {
  const db = await getDatabase();
  const rows = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`(count(*) filter (where ${couponDeals.isActive} = true))::int`,
    })
    .from(couponDeals);
  const row = rows[0];
  return { total: row?.total ?? 0, active: row?.active ?? 0 };
}

/** Total click-throughs across every row (home stat strip, cached). */
export async function sumClicksCached(): Promise<number> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const rows = await db
    .select({
      clicks: sql<number>`coalesce(sum(${couponDeals.clickCount}), 0)::int`,
    })
    .from(couponDeals);
  return rows[0]?.clicks ?? 0;
}

/**
 * Related deals for the detail page: same category first, then same merchant,
 * always excluding the current row. Reads stay cached like the rest of the
 * storefront lists.
 */
export async function listRelatedDeals(
  id: string,
  options: { category?: string; merchant?: string | null; limit?: number },
): Promise<CouponDeal[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  const limit = options.limit ?? 4;
  const notSelf = ne(couponDeals.id, id);

  let rows: CouponDeal[] = [];
  if (options.category) {
    rows = await db
      .select()
      .from(couponDeals)
      .where(
        and(
          activeWhere(),
          notSelf,
          sql`${couponDeals.categories} @> ARRAY[${options.category}]::text[]`,
        ),
      )
      .orderBy(...orderClause())
      .limit(limit);
  }
  if (rows.length < limit) {
    const extra = await db
      .select()
      .from(couponDeals)
      .where(and(activeWhere(options.merchant ?? undefined), notSelf))
      .orderBy(...orderClause())
      .limit(limit);
    const seen = new Set(rows.map((r) => r.id));
    rows = [...rows, ...extra.filter((r) => !seen.has(r.id))].slice(0, limit);
  }
  return rows;
}

/**
 * Active campaign banners for the home promo slots — Accesstrade-synced
 * creatives plus any manually curated rows. Tagged like the deal lists so a
 * sync run refreshes banners in the same invalidation pass.
 */
export async function listActiveBanners(limit = 4): Promise<CampaignBanner[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(SITE.couponsTag);
  const db = await getDatabase();
  return db
    .select()
    .from(campaignBanners)
    .where(eq(campaignBanners.isActive, true))
    .orderBy(asc(campaignBanners.sortOrder), desc(campaignBanners.createdAt))
    .limit(limit);
}

/** All banners (any state) for the admin management table — always fresh. */
export async function listAllBannersRaw(): Promise<CampaignBanner[]> {
  const db = await getDatabase();
  return db
    .select()
    .from(campaignBanners)
    .orderBy(asc(campaignBanners.sortOrder), desc(campaignBanners.createdAt));
}

/**
 * Public <img> src for a banner creative with a cache-busting version derived
 * from updatedAt. Browsers that cached corrupted bytes (e.g. from the legacy
 * service-worker era, or any stale creative) re-fetch the fresh bytes
 * automatically whenever the row changes — no manual cache clearing needed.
 */
export function bannerImageSrc(
  banner: Pick<CampaignBanner, "imageUrl" | "updatedAt">,
): string {
  const version = banner.updatedAt
    ? Math.floor(banner.updatedAt.getTime() / 1000)
    : 1;
  const sep = banner.imageUrl.includes("?") ? "&" : "?";
  return `${banner.imageUrl}${sep}v=${version}`;
}

export type AdminDealQuery = {
  q?: string; // matches title or code
  merchant?: string;
  status?: "active" | "inactive" | "all";
  page?: number; // 1-based
  perPage?: number; // default 20
};

/**
 * Admin deal table feed with search, merchant/status filters and pagination.
 * Always fresh (behind the admin auth session anyway).
 */
export async function listDealsAdmin(
  options: AdminDealQuery = {},
): Promise<{ deals: CouponDeal[]; total: number }> {
  const db = await getDatabase();
  const conditions = [];

  const q = options.q?.trim();
  if (q) {
    const needle = `%${q}%`;
    conditions.push(
      or(
        ilike(couponDeals.title, needle),
        ilike(couponDeals.code, needle),
      ),
    );
  }
  if (options.merchant) {
    conditions.push(eq(couponDeals.merchant, options.merchant));
  }
  if (options.status === "active") {
    conditions.push(eq(couponDeals.isActive, true));
  } else if (options.status === "inactive") {
    conditions.push(eq(couponDeals.isActive, false));
  }

  const where = conditions.length ? and(...conditions) : undefined;
  const perPage = options.perPage ?? 20;
  const page = Math.max(1, options.page ?? 1);

  const [deals, totals] = await Promise.all([
    db
      .select()
      .from(couponDeals)
      .where(where)
      .orderBy(asc(couponDeals.isActive), desc(couponDeals.updatedAt))
      .limit(perPage)
      .offset((page - 1) * perPage),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(couponDeals)
      .where(where),
  ]);

  return { deals, total: totals[0]?.total ?? 0 };
}
