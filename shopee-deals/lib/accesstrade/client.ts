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
