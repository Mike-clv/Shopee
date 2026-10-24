import Image from "next/image";
import { CopyButton } from "./CopyButton";
import { cn, formatDayVi, truncateVi } from "@/lib/utils";
import type { CouponDeal } from "@/lib/db/schema";

export function CouponCard({ deal }: { deal: CouponDeal }) {
  const hasCode = Boolean(deal.code);
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border bg-white shadow-sm transition hover:shadow-md",
        deal.isFeatured
          ? "border-[#ee4d2d]/60 ring-1 ring-[#ee4d2d]/30"
          : "border-neutral-200",
      )}
    >
      {deal.isFeatured && (
        <span className="absolute -top-2 left-3 rounded-full bg-[#ee4d2d] px-2 py-0.5 text-[11px] font-semibold text-white shadow">
          🔥 Hot
        </span>
      )}
      <div className="flex gap-3 p-3">
        <Thumb deal={deal} />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug text-neutral-900">
            <a
              href={`/ma/${deal.id}`}
              className="hover:text-[#ee4d2d]"
              title={deal.title}
            >
              {truncateVi(deal.title, 70)}
            </a>
          </h3>
          <p className="mt-0.5 text-xs text-neutral-500">
            {deal.merchantName ?? deal.merchant}
            {deal.endTime ? ` · HSD: ${formatDayVi(deal.endTime)}` : ""}
          </p>
        </div>
      </div>

      {deal.content ? (
        <p className="px-3 pb-2 text-xs leading-relaxed text-neutral-600 line-clamp-2">
          {truncateVi(deal.content, 110)}
        </p>
      ) : null}

      <div className="mt-auto flex items-center gap-2 p-3 pt-0">
        {hasCode ? (
          <CopyButton code={deal.code!} goPath={`/go/${deal.id}`} />
        ) : (
          <a
            href={`/go/${deal.id}`}
            target="_blank"
            rel="noopener nofollow"
            className="flex-1 rounded-lg bg-[#ee4d2d] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#d73211]"
          >
            Nhận ưu đãi →
          </a>
        )}
      </div>
    </article>
  );
}

function Thumb({ deal }: { deal: CouponDeal }) {
  if (deal.image) {
    return (
      <Image
        src={deal.image}
        alt={deal.title}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
        unoptimized // AT images have unknown sizes; avoid /_next/image complaining
      />
    );
  }
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#ee4d2d]/10 text-xl font-bold text-[#ee4d2d]">
      #{(deal.merchantName ?? deal.merchant ?? "S").slice(0, 2).toUpperCase()}
    </div>
  );
}
