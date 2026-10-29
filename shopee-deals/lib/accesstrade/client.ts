import "server-only";
import { z } from "zod";

/**
 * Accesstrade Vietnam publisher API client.
 *
 * Docs (VN platform): https://developers.accesstrade.vn
 * Auth style: `Authorization: Token <access_key>` (NOT Bearer on .vn).
 * Coupon source: GET /v1/offers_informations (vouchers, deals & aff links).
 *
 * The parser is intentionally lenient: AT adds fields without notice, so the
 * zod schemas keep extra data and tolerate missing optionals.
 */

const API_BASE =
  process.env.ACCESSTRADE_API_BASE?.trim() || "https://api.accesstrade.vn";

export function hasAccessKey(): boolean {
  return Boolean(process.env.ACCESSTRADE_ACCESS_KEY?.trim());
}

function authHeaders(): HeadersInit {
  const key = process.env.ACCESSTRADE_ACCESS_KEY?.trim();
  return {
    Authorization: `Token ${key ?? ""}`,
    "Content-Type": "application/json",
  };
}

/** Raw offer record from /v1/offers_informations. */
export const atOfferSchema = z.looseObject({
  id: z.string(),
  name: z.string(),
  content: z.string().optional(),
  link: z.string().optional(),
  aff_link: z.string(),
  merchant: z.string(),
  domain: z.string().optional(),
  image: z.string().optional(),
  banners: z.array(z.unknown()).optional(),
  categories: z.array(z.unknown()).optional(),
  // AT sends "2021-03-27" but may upgrade to full ISO — parse leniently.
  start_time: z.string().nullable().optional(),
  end_time: z.string().nullable().optional(),
  // Present (shape varies) when the offer carries promo codes.
  coupons: z.array(z.unknown()).optional(),
});

export type ATOffer = z.infer<typeof atOfferSchema>;

const offerListSchema = z.looseObject({
  data: z.array(atOfferSchema).default([]),
});

/** Extracts a promo code from the loosely-shaped `coupons` field. */
export function extractCode(offer: ATOffer): string | null {
  const first = offer.coupons?.[0];
  if (first == null) return null;
  if (typeof first === "string") {
    const trimmed = first.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (typeof first === "object") {
    const rec = first as Record<string, unknown>;
    for (const key of ["coupon_code", "code", "voucher"]) {
      const value = rec[key];
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
  }
  return null;
}

/** AT end dates are date-only strings; VN consumers expect end of day +07. */
export function parseAtDate(value: string | undefined | null, endOfDay: boolean): Date | null {
  if (!value) return null;
  const m = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const time = endOfDay ? "23:59:59" : "00:00:00";
  return new Date(`${y}-${mo}-${d}T${time}+07:00`);
}

export type FetchOffersParams = {
  merchants: string[];
  withCoupon: "all" | "with" | "without";
  onlyActive: boolean;
  pageSize: number;
  maxPages: number;
};

export type FetchOffersResult = {
  offers: ATOffer[];
  fetchedCount: number;
  warnings: string[];
};

/**
 * Paged GET /v1/offers_informations.
 * A page returning fewer items than the page size stops the loop.
 */
export async function fetchOffers(
  params: FetchOffersParams,
): Promise<FetchOffersResult> {
  const offers: ATOffer[] = [];
  const warnings: string[] = [];
  let fetchedCount = 0;

  for (let page = 1; page <= params.maxPages; page++) {
    const url = new URL(`${API_BASE}/v1/offers_informations`);
    url.searchParams.set("merchant", params.merchants.join(","));
    if (params.onlyActive) url.searchParams.set("status", "1");
    if (params.withCoupon === "with") url.searchParams.set("coupon", "1");
    if (params.withCoupon === "without") url.searchParams.set("coupon", "0");
    url.searchParams.set("limit", String(params.pageSize));
    url.searchParams.set("page", String(page));

    let res: Response;
    try {
      res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    } catch (error) {
      throw new Error(`Cannot reach Accesstrade API: ${String(error)}`);
    }

    if (res.status === 401 || res.status === 403) {
      throw new Error("Accesstrade rejected the access key (check ACCESSTRADE_ACCESS_KEY).");
    }
    if (!res.ok) {
      throw new Error(`Accesstrade API HTTP ${res.status} on page ${page}.`);
    }

    const json: unknown = await res.json().catch(
      () => Promise.reject(new Error("Accesstrade API returned invalid JSON.")),
    );
    const parsed = offerListSchema.safeParse(json);
    if (!parsed.success) {
      warnings.push(
        `Page ${page}: unexpected response shape (${parsed.error.issues.length} issues). Stopping.`,
      );
      break;
    }

    offers.push(...parsed.data.data);
    fetchedCount += parsed.data.data.length;

    if (parsed.data.data.length < params.pageSize) break;
  }

  return { offers, fetchedCount, warnings };
}

// ---------------------------------------------------------------------------
// Datafeeds: product-level feeds (Tiki, Lazada — no promo codes, own aff link).
// Verified live: GET /v1/datafeeds?domain=lazada.vn&limit=2&page=1 →
//   { total, data: [{ product_id, sku, name, price (original), discount (sale),
//      discount_rate, image, url, aff_link, campaign, domain, cate, desc, ... }] }
// ---------------------------------------------------------------------------

export const atDatafeedProductSchema = z.looseObject({
  product_id: z.union([z.string(), z.number()]).transform(String),
  sku: z.union([z.string(), z.number()]).transform(String),
  name: z.string(),
  price: z.number().nullable().optional(),
  discount: z.number().nullable().optional(),
  discount_rate: z.number().nullable().optional(),
  image: z.string().optional(),
  aff_link: z.string(),
  url: z.string().optional(),
  campaign: z.string().optional(),
  domain: z.string().optional(),
  cate: z.string().optional(),
  desc: z.string().optional(),
  merchant: z.string().optional(),
});

export type ATDatafeedProduct = z.infer<typeof atDatafeedProductSchema>;

const datafeedListSchema = z.looseObject({
  total: z.number().optional(),
  data: z.array(atDatafeedProductSchema).default([]),
});

export type FetchDatafeedsParams = {
  domains: string[];
  pageSize: number;
  maxPages: number;
};

/**
 * Paged GET /v1/datafeeds per domain. A short page stops that domain's loop;
 * an empty first page emits a warning instead of failing the whole sync.
 */
export async function fetchDatafeeds(
  params: FetchDatafeedsParams,
): Promise<{ products: ATDatafeedProduct[]; fetchedCount: number; warnings: string[] }> {
  const products: ATDatafeedProduct[] = [];
  const warnings: string[] = [];
  let fetchedCount = 0;

  for (const domain of params.domains) {
    for (let page = 1; page <= params.maxPages; page++) {
      const url = new URL(`${API_BASE}/v1/datafeeds`);
      url.searchParams.set("domain", domain);
      url.searchParams.set("limit", String(params.pageSize));
      url.searchParams.set("page", String(page));

      let res: Response;
      try {
        res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
      } catch (error) {
        throw new Error(`Cannot reach Accesstrade datafeed (${domain}): ${String(error)}`);
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error("Accesstrade rejected the access key (check ACCESSTRADE_ACCESS_KEY).");
      }
      if (!res.ok) {
        throw new Error(`Accesstrade datafeed HTTP ${res.status} on ${domain} page ${page}.`);
      }

      const json: unknown = await res.json().catch(
        () => Promise.reject(new Error(`Accesstrade datafeed ${domain} returned invalid JSON.`)),
      );
      const parsed = datafeedListSchema.safeParse(json);
      if (!parsed.success) {
        warnings.push(
          `Datafeed ${domain} page ${page}: unexpected shape (${parsed.error.issues.length} issues). Stopping domain.`,
        );
        break;
      }

      const items = parsed.data.data;
      products.push(...items);
      fetchedCount += items.length;
      if (items.length < params.pageSize) break;
    }
  }

  return { products, fetchedCount, warnings };
}

// ---------------------------------------------------------------------------
// TikTok Shop: product search v2 + affiliate link creation.
// Verified live:
//   GET /v2/tiktokshop_product_feeds?sort_field=HIGH_COMMISSION_RATE&limit=3
//       &title_keywords=quần → { status, data: { next_page_token, total_count,
//       products: [{ id, title, detail_link, main_image_url, units_sold,
//       commission_rate, sales_price{minimum_amount…}, original_price{…}, … }] } }
//   POST /v2/tiktokshop_product_feeds/create_link?minify=true body
//       { product_url } → { status, message, data: { aff_short_url, aff_url } }
// ---------------------------------------------------------------------------

const priceRangeSchema = z.looseObject({
  currency: z.string().optional(),
  minimum_amount: z.union([z.string(), z.number()]).nullable().optional(),
  maximum_amount: z.union([z.string(), z.number()]).nullable().optional(),
});

export const tiktokProductSchema = z.looseObject({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string(),
  detail_link: z.string(),
  main_image_url: z.string().optional(),
  units_sold: z.number().nullable().optional(),
  commission: z
    .looseObject({ rate: z.union([z.string(), z.number()]).optional() })
    .optional(),
  commission_rate: z.union([z.string(), z.number()]).nullable().optional(),
  sales_price: priceRangeSchema.optional(),
  original_price: priceRangeSchema.optional(),
  category_chains: z
    .array(z.looseObject({ local_name: z.string().optional() }))
    .optional(),
  shop: z.looseObject({ name: z.string().optional() }).optional(),
});

export type TiktokProduct = z.infer<typeof tiktokProductSchema>;

const tiktokSearchSchema = z.looseObject({
  status: z.boolean().optional(),
  data: z.looseObject({
    next_page_token: z.string().optional(),
    total_count: z.number().optional(),
    products: z.array(tiktokProductSchema).default([]),
  }),
});

export type SearchTiktokParams = {
  keywords: string[];
  limit: number;
  maxPages: number;
};

export type TiktokSearchPage = {
  products: TiktokProduct[];
  nextPageToken: string | null;
};

/** One page of GET /v2/tiktokshop_product_feeds (safeParse — never throws on shape). */
export async function searchTiktokProducts(
  keyword: string,
  limit: number,
  pageToken?: string | null,
): Promise<TiktokSearchPage> {
  const url = new URL(`${API_BASE}/v2/tiktokshop_product_feeds`);
  url.searchParams.set("sort_field", "HIGH_COMMISSION_RATE");
  url.searchParams.set("limit", String(limit));
  if (keyword.trim()) url.searchParams.set("title_keywords", keyword.trim());
  if (pageToken) url.searchParams.set("page_token", pageToken);

  let res: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      // Burst 429s: backoff then retry once (same as create_link).
      await new Promise((resolve) => setTimeout(resolve, 1600));
    }
    try {
      res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
    } catch (error) {
      throw new Error(`Cannot reach Accesstrade TikTok API: ${String(error)}`);
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error("Accesstrade rejected the access key (check ACCESSTRADE_ACCESS_KEY).");
    }
    if (res.status !== 429) break;
  }
  if (!res || !res.ok) {
    throw new Error(`Accesstrade TikTok search HTTP ${res?.status ?? "no-response"}.`);
  }

  const json: unknown = await res.json().catch(
    () => Promise.reject(new Error("Accesstrade TikTok search returned invalid JSON.")),
  );
  const parsed = tiktokSearchSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Accesstrade TikTok search unexpected shape (${parsed.error.issues.length} issues).`,
    );
  }
  return {
    products: parsed.data.data.products,
    nextPageToken: parsed.data.data.next_page_token || null,
  };
}

const tiktokLinkSchema = z.looseObject({
  status: z.boolean().optional(),
  message: z.string().optional(),
  data: z
    .looseObject({
      aff_short_url: z.string().optional(),
      aff_url: z.string().optional(),
    })
    .optional(),
});

/**
 * POST /v2/tiktokshop_product_feeds/create_link?minify=true. `minify` skips
 * re-fetching product details (we already have them from search), keeping the
 * per-product call fast. Returns the affiliate URL, or null when AT rejects
 * the product (status:false body with HTTP 200 — e.g. not part of the
 * campaign or invalid product), or throws on infrastructure errors.
 * Retries one burst-rate 429 with a short backoff.
 */
export async function createTiktokLink(
  productUrl: string,
): Promise<string | null> {
  const url = new URL(`${API_BASE}/v2/tiktokshop_product_feeds/create_link`);
  url.searchParams.set("minify", "true");
  let res: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      // Burst 429s observed live — one short backoff recovers most calls.
      await new Promise((resolve) => setTimeout(resolve, 1600));
    }
    try {
      res = await fetch(url, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ product_url: productUrl }),
        cache: "no-store",
      });
    } catch (error) {
      throw new Error(`Cannot reach Accesstrade TikTok create_link: ${String(error)}`);
    }
    if (res.status !== 429) break;
  }
  if (!res || !res.ok) {
    throw new Error(`Accesstrade TikTok create_link HTTP ${res?.status ?? "no-response"}.`);
  }

  const json: unknown = await res.json().catch(
    () => Promise.reject(new Error("Accesstrade TikTok create_link returned invalid JSON.")),
  );
  const parsed = tiktokLinkSchema.safeParse(json);
  if (!parsed.success) {
    throw new Error(
      `Accesstrade TikTok create_link unexpected shape (${parsed.error.issues.length} issues).`,
    );
  }
  // AT answers HTTP 200 with status:false for product-level rejections
  // (e.g. 98001004 invalid params / not in campaign) — null = skip row.
  if (parsed.data.status === false) {
    return null;
  }
  const data = parsed.data.data;
  const link = data?.aff_short_url?.trim() || data?.aff_url?.trim() || "";
  return link ? link : null;
}
