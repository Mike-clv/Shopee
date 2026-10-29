import Link from "next/link";
import { Clock, ExternalLink, Flame } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { DealImage } from "./DealImage";
import { cn, formatDayVi, formatDiscountVi, formatPriceVi, truncateVi } from "@/lib/utils";
import { merchantLabel } from "@/lib/site";
import type { CouponDeal } from "@/lib/db/schema";

const MERCHANT_DOT: Record<string, string> = {
  shopee: "bg-orange-500",
  lazada: "bg-blue-600",
  tiki: "bg-blue-500",
  tiktokshop: "bg-black",
};

/**
 * Small square coupon tile: short image head with discount/hot overlays,
 * tight merchant/title/price body, then a full-width copy-code CTA pinned to
 * the bottom. Denser grids (2–5 columns) keep every tile roughly square.
 */
export function CouponCard({ deal }: { deal: CouponDeal }) {
  const hasCode = Boolean(deal.code);
  const price = formatPriceVi(deal.price);
  const discount = formatDiscountVi(deal.discountRate);
  const label = merchantLabel(deal.merchant);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg">
      <div className="relative shrink-0">
        <Link href={`/ma/${deal.id}`} aria-label={deal.title} className="block">
          <DealImage
            src={deal.image ?? ""}
            alt={deal.title}
            initials={(label || deal.merchantName || "S").slice(0, 2).toUpperCase()}
            width={480}
            height={320}
            eager={deal.isFeatured}
            className="h-24 w-full rounded-none bg-muted sm:h-32"
            plateClassName="h-24 w-full rounded-none text-xl sm:h-32"
          />
        </Link>
        {discount && (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[10px] leading-none font-bold text-white shadow-sm">
            {discount.replace("-", "")}
          </span>
        )}
        {deal.isFeatured && (
          <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-white/95 px-1.5 py-0.5 text-[9px] leading-none font-bold tracking-wide text-accent uppercase shadow-sm">
            <Flame className="h-2.5 w-2.5" aria-hidden />
            Hot
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-2">
        <p className="flex items-center gap-1 text-[10px] text-ink/45">
          <span
            aria-hidden
            className={cn(
              "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
              MERCHANT_DOT[deal.merchant] ?? "bg-ink/40",
            )}
          />
          <span className="truncate">{label || deal.merchantName || "Đa sàn"}</span>
          {deal.endTime && (
            <span className="ml-auto inline-flex shrink-0 items-center gap-0.5 rounded-full bg-red-50 px-1 py-0.5 text-[9px] font-semibold text-red-600">
              <Clock className="h-2.5 w-2.5" aria-hidden />
              {formatDayVi(deal.endTime)}
            </span>
          )}
        </p>

        <h3 className="mt-1 line-clamp-2 font-display text-xs leading-snug font-semibold text-ink transition-colors group-hover:text-brand">
          <Link href={`/ma/${deal.id}`} title={deal.title}>
            {truncateVi(deal.title, 80)}
          </Link>
        </h3>

        <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          {discount ? (
            <>
              <span className="text-[13px] font-bold text-brand">
                Giảm {discount.replace("-", "")}
              </span>
              {price && <span className="text-[11px] font-medium text-ink/45">{price}</span>}
            </>
          ) : (
            <span className="text-[13px] font-bold text-brand">
              {price ?? "Ưu đãi đang chạy"}
            </span>
          )}
        </p>

        <div className="mt-auto pt-2">
          {hasCode ? (
            <CopyButton code={deal.code!} goPath={`/go/${deal.id}`} variant="tile" />
          ) : (
            <a
              href={`/go/${deal.id}`}
              target="_blank"
              rel="noopener nofollow"
              className="flex h-8 items-center justify-center gap-1 rounded-full bg-brand text-[11px] font-semibold text-white transition hover:bg-brand-dark"
            >
              <ExternalLink className="h-3 w-3" aria-hidden />
              Xem deal
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
