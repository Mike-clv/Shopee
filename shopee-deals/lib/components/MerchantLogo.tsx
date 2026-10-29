import { merchantLabel, type Merchant } from "@/lib/site";

/**
 * Official brand logos served as local static files under /logos — nothing is
 * fetched remotely at render time. Sources (downloaded once):
 * - shopee.svg / tiktok.svg — simple-icons glyphs in official brand colors.
 * - lazada.ico — official Lazada app icon (lazada.vn/favicon.ico).
 * - tiki.png — official Tiki.vn wordmark via Wikimedia Commons (PD-textlogo).
 */
const MERCHANT_LOGO_SRC: Partial<Record<Merchant, string>> = {
  shopee: "/logos/shopee.svg",
  tiki: "/logos/tiki.png",
  lazada: "/logos/lazada.ico",
  tiktokshop: "/logos/tiktok.svg",
};

/** Wordmark files need a wider plate to stay legible at pill size. */
const MERCHANT_LOGO_ASPECT: Partial<Record<Merchant, number>> = {
  tiki: 2.2,
};

/**
 * Small white "plate" holding the raw brand asset so every logo keeps its
 * official colors on any pill/tint background. Decorative by design — the
 * merchant name is always rendered as adjacent text for accessibility.
 */
export function MerchantLogo({
  merchant,
  size = 20,
  className = "",
}: {
  merchant?: string | null;
  size?: number;
  className?: string;
}) {
  const known = merchant ? (merchant as Merchant) : null;
  const src = known ? MERCHANT_LOGO_SRC[known] : undefined;

  if (!src) {
    // Unmapped merchant → letter plate so rows never render broken.
    return (
      <span
        aria-hidden
        className={`inline-flex shrink-0 items-center justify-center rounded-md bg-brand/10 font-bold text-brand ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(8, size * 0.45) }}
      >
        {(merchantLabel(merchant) || merchant || "?").slice(0, 1).toUpperCase()}
      </span>
    );
  }

  const width = Math.round(size * ((known && MERCHANT_LOGO_ASPECT[known]) || 1));
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-md bg-white shadow-sm ring-1 ring-black/10 ${className}`}
      style={{ height: size, width }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- brand SVG/ICO assets ship as static files and must not go through next/image (dangerouslyAllowSVG + optimizer overhead) */}
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        style={{ height: Math.round(size * 0.72), width: Math.round(width * 0.72) }}
      />
    </span>
  );
}
