/** Global shared constants. Site-level config only — no secrets here. */

export const SITE = {
  name: "Mã Giảm Giá Đa Sàn",
  shortName: "Mã Giảm Giá",
  description:
    "Tổng hợp mã giảm giá Shopee và deal hot Tiki, TikTok Shop, Lazada — cập nhật tự động 24/7 qua Accesstrade. Voucher freeship, giảm giá sâu và sản phẩm deal đa sàn.",
  defaultUrl: "http://localhost:3000",
  // Everything cached under this tag is invalidated when coupons change.
  couponsTag: "coupons",
  adminPath: "/admin",
  targetMerchants: ["shopee"],
  /** All merchants surfaced in the multi-marketplace UI. */
  merchants: ["shopee", "tiki", "lazada", "tiktokshop"],
  /** Display labels keyed by merchant slug. */
  merchantLabels: {
    shopee: "Shopee",
    tiki: "Tiki",
    lazada: "Lazada",
    tiktokshop: "TikTok Shop",
  },
  /** Canonical storefront domains per merchant (synced rows carry these). */
  merchantDomains: {
    shopee: "shopee.vn",
    tiki: "tiki.vn",
    lazada: "lazada.vn",
    tiktokshop: "shop.tiktok.com",
  },
  /**
   * Outbound "Nguồn deal" buttons on the hero. shopee/tiki/lazada go through
   * the AccessTrade deep-link wrapper (same publisher wrapper every synced
   * deal uses) so homepage clicks keep affiliate tracking. TikTok Shop is not
   * accepted by the deep-link tool (404) and its deals are tracked per-product
   * via shorten.asia, so its button links the storefront directly — swap in a
   * tracked URL here if one is ever created in the AT dashboard.
   */
  merchantHomeLinks: {
    shopee: "https://go.isclix.com/deep_link/6041223145843920598?url=https%3A%2F%2Fshopee.vn",
    tiki: "https://go.isclix.com/deep_link/6041223145843920598?url=https%3A%2F%2Ftiki.vn",
    lazada: "https://go.isclix.com/deep_link/6041223145843920598?url=https%3A%2F%2Fwww.lazada.vn",
    tiktokshop: "https://www.tiktok.com/shop",
  },
} as const;

export type Merchant = (typeof SITE.merchants)[number];

export function merchantLabel(merchant: string | null | undefined): string {
  if (!merchant) return "";
  const label = (SITE.merchantLabels as Record<string, string>)[merchant];
  return label ?? merchant;
}

export function merchantDomain(merchant: string | null | undefined): string {
  if (!merchant) return "";
  const domain = (SITE.merchantDomains as Record<string, string>)[merchant];
  return domain ?? "";
}

export function isKnownMerchant(merchant: string | null | undefined): merchant is Merchant {
  return merchant != null && merchant.length > 0
    ? SITE.merchants.includes(merchant as Merchant)
    : false;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? SITE.defaultUrl;
}
