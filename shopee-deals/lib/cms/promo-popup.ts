import { SITE } from "@/lib/site";

/**
 * Public entrance-popup content. Stored as a single JSON object under the
 * `promoPopup` key in `site_settings` so the whole banner can be updated
 * atomically from Cpanel.
 */
export type PromoPopupSettings = {
  enabled: boolean;
  imageUrl: string;
  href: string;
  alt: string;
  title: string;
};

export const DEFAULT_PROMO_POPUP: PromoPopupSettings = {
  enabled: true,
  imageUrl: "/images/khuyen-mai/11-11-shopee-2026.jpg",
  href: SITE.merchantHomeLinks.shopee,
  alt: "Shopee 11.11 - Tiệc sale mở màn: siêu rẻ từ 1.000đ, triệu phụ voucher giảm đến 50%, freeship 0đ",
  title: "Ưu đãi Shopee 11.11",
};

/** Internal path or absolute http(s) URL; blocks javascript:/data: schemes. */
export function isSafePromoUrl(value: string): boolean {
  return (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value);
}

function text(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export function normalizePromoPopup(value: unknown): PromoPopupSettings {
  const source =
    value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const imageUrl = text(source.imageUrl, DEFAULT_PROMO_POPUP.imageUrl);
  const href = text(source.href, DEFAULT_PROMO_POPUP.href);

  return {
    // Missing key = feature was never configured; keep the original popup on.
    enabled: typeof source.enabled === "boolean" ? source.enabled : true,
    imageUrl: isSafePromoUrl(imageUrl) ? imageUrl : DEFAULT_PROMO_POPUP.imageUrl,
    href: isSafePromoUrl(href) ? href : DEFAULT_PROMO_POPUP.href,
    alt: text(source.alt, DEFAULT_PROMO_POPUP.alt),
    title: text(source.title, DEFAULT_PROMO_POPUP.title),
  };
}
