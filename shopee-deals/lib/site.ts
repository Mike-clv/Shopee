/** Global shared constants. Site-level config only — no secrets here. */

export const SITE = {
  name: "Shopee Mã Giảm Giá",
  shortName: "ShopeeMã",
  description:
    "Tổng hợp mã giảm giá Shopee mới nhất, cập nhật tự động 24/7 qua Accesstrade. Mã giảm giá shipment, mã xxx% và deal hot miễn phí.",
  defaultUrl: "http://localhost:3000",
  // Everything cached under this tag is invalidated when coupons change.
  couponsTag: "coupons",
  adminPath: "/admin",
  targetMerchants: ["shopee"],
} as const;

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? SITE.defaultUrl;
}
