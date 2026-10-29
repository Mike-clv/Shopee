import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { CAMPAIGNS } from "@/lib/campaigns";
import { bannerImageSrc, listActiveBanners } from "@/lib/coupons/data";

/**
 * Two large promo banner slots under the hero. When the pub2 sync has stored
 * campaign banner creatives they are rendered as real image cards (each links
 * to the campaign landing page); otherwise the static campaign gradient cards
 * take over so the section is never empty.
 */
export async function PromoBanners() {
  const banners = (await listActiveBanners(8))
    .filter((banner) => banner.kind === "banner")
    .slice(0, 4);

  if (banners.length === 0) {
    return <CampaignBannerCards />;
  }

  return (
    <section aria-label="Ưu đãi nổi bật" className="grid gap-4 md:grid-cols-2">
      {banners.map((banner, index) => {
        const media = (
          <span className="promo-banner-card relative block overflow-hidden">
            {/* Plain <img> on purpose: banner creatives come from AT CDNs with arbitrary sizes. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImageSrc(banner)}
              alt={banner.title ?? "Banner ưu đãi"}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
              className="block h-auto w-full"
            />
            <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold tracking-wide text-brand uppercase shadow-sm">
              <Megaphone className="h-3 w-3" aria-hidden />
              Ưu đãi nổi bật
            </span>
          </span>
        );

        return banner.linkUrl?.startsWith("http") ? (
          <a
            key={banner.id}
            href={banner.linkUrl}
            target="_blank"
            rel="noopener nofollow"
            aria-label={banner.title ?? "Xem ưu đãi"}
          >
            {media}
          </a>
        ) : (
          <Link key={banner.id} href={banner.linkUrl ?? "/tim-kiem"}>
            {media}
          </Link>
        );
      })}
    </section>
  );
}

/** Static gradient fallback when no campaign banners are synced yet. */
function CampaignBannerCards() {
  return (
    <section aria-label="Ưu đãi nổi bật" className="grid gap-4 md:grid-cols-2">
      {CAMPAIGNS.slice(0, 2).map((campaign) => {
        const Icon = campaign.icon;
        return (
          <Link
            key={campaign.id}
            href={campaign.href}
            className={`promo-banner-card relative flex min-h-[188px] flex-col justify-between overflow-hidden border-0 p-6 text-white ${campaign.gradient}`}
          >
            <span aria-hidden className="absolute inset-0 bg-black/5" />
            <Icon
              aria-hidden
              className="absolute -right-4 -bottom-5 h-32 w-32 text-white/15"
              strokeWidth={1.25}
            />
            <span className="relative inline-flex w-fit items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold tracking-wide text-brand uppercase shadow-sm">
              <Megaphone className="h-3 w-3" aria-hidden />
              Ưu đãi nổi bật
            </span>
            <span className="relative mt-7 block max-w-sm">
              <span className="block font-display text-2xl leading-tight font-bold">
                {campaign.title}
              </span>
              <span className="mt-1.5 block text-sm text-white/80">
                {campaign.subtitle}
              </span>
            </span>
            <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Săn ngay
              <ArrowRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
        );
      })}
    </section>
  );
}

/** Loading placeholder matching the 2-up image banner grid. */
export function PromoBannersSkeleton() {
  return (
    <div
      aria-hidden
      className="grid gap-4 md:grid-cols-2"
      data-testid="promo-banners-skeleton"
    >
      {[0, 1].map((index) => (
        <div
          key={index}
          className="shimmer h-[180px] rounded-xl border border-line bg-white"
        />
      ))}
    </div>
  );
}

/** Full-width CTA strip reused between content sections. */
export function PromoWide() {
  return (
    <Link
      href="/tim-kiem"
      className="group relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-r from-brand/10 via-white to-white p-6 shadow-sm transition hover:border-brand/35 hover:shadow-md sm:p-8"
    >
      <Megaphone
        aria-hidden
        className="absolute -top-4 right-4 h-32 w-32 text-brand/5"
        strokeWidth={1}
      />
      <div className="relative min-w-0 max-w-xl">
        <p className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
          Không bỏ lỡ deal hot
        </p>
        <p className="mt-1 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
          Săn mã mỗi ngày trên 4 sàn lớn
        </p>
        <p className="mt-1 text-sm text-ink/50">
          Deal mới về liên tục 24/7 — dùng ngay, không cần đăng ký.
        </p>
      </div>
      <span className="relative inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/25 transition group-hover:bg-brand-dark">
        Tìm mã ngay
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}

