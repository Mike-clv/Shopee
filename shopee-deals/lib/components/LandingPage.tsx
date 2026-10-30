import Link from "next/link";
import { ChevronDown, ChevronRight, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { CouponCard } from "@/lib/components/CouponCard";
import type { CouponDeal } from "@/lib/db/schema";
import type { LandingFaq } from "@/lib/landing/content";

type Crumb = { label: string; href?: string };

export function LandingPage({
  badge,
  title,
  description,
  intro,
  highlights,
  stats,
  deals,
  faqs,
  breadcrumb,
  moreHref,
  moreLabel = "Xem tất cả deal",
  emptyTitle = "Chưa có deal phù hợp",
  emptyDescription = "Danh sách đang được cập nhật. Bạn có thể xem các deal mới nhất trên trang tìm kiếm.",
  sidebar,
}: {
  badge: string;
  title: string;
  description: string;
  intro: string[];
  highlights: string[];
  stats: Array<{ label: string; value: string }>;
  deals: CouponDeal[];
  faqs: LandingFaq[];
  breadcrumb: Crumb[];
  moreHref: string;
  moreLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  sidebar: ReactNode;
}) {
  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        {breadcrumb.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-1">
            {index > 0 && <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />}
            {crumb.href ? (
              <Link href={crumb.href} className="transition hover:text-brand">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink/60">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <header className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-brand/10 via-white to-white p-6 sm:p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-brand/10 blur-2xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-white/80 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
            {badge}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/55">
            {description}
          </p>
          <dl className="mt-6 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white px-4 py-3">
                <dt className="text-[10px] font-medium tracking-wide text-ink/40 uppercase">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 font-display text-lg font-bold text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-8">
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Tổng quan
            </h2>
            <div className="mt-3 space-y-3">
              {intro.map((paragraph, index) => (
                <p key={index} className="text-[14.5px] leading-7 text-ink/65">
                  {paragraph}
                </p>
              ))}
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-6 text-ink/60">
                  <span
                    aria-hidden
                    className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand/60"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="landing-deals-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="landing-deals-heading"
                  className="font-display text-xl font-bold tracking-tight text-ink"
                >
                  Deal đang được quan tâm
                </h2>
                <p className="mt-1 text-xs text-ink/45">
                  Giá và điều kiện có thể thay đổi — kiểm tra lại trên trang đích trước khi mua.
                </p>
              </div>
              <Link
                href={moreHref}
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:underline"
              >
                {moreLabel}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {deals.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                {deals.map((deal) => (
                  <CouponCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
                <p className="font-display text-lg font-semibold text-ink">{emptyTitle}</p>
                <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink/50">
                  {emptyDescription}
                </p>
                <Link
                  href={moreHref}
                  className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
                >
                  Xem deal mới nhất
                </Link>
              </div>
            )}
          </section>

          <section aria-labelledby="landing-faq-heading">
            <h2
              id="landing-faq-heading"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Câu hỏi thường gặp
            </h2>
            <div className="mt-4 space-y-2.5">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-line bg-white p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
                    {faq.question}
                    <ChevronDown
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-ink/35 transition group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">{sidebar}</aside>
      </div>
    </div>
  );
}

export function LandingSidebarCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-4">
      <h2 className="text-xs font-semibold tracking-wide text-ink/45 uppercase">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function LandingLinkList({
  links,
}: {
  links: Array<{ href: string; label: string; meta?: string }>;
}) {
  return (
    <ul className="space-y-1">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs text-ink/60 transition hover:bg-ink/[0.03] hover:text-brand"
          >
            <span className="min-w-0 truncate">{link.label}</span>
            {link.meta ? (
              <span className="shrink-0 font-mono text-[10px] text-ink/35">{link.meta}</span>
            ) : (
              <ChevronRight aria-hidden className="h-3 w-3 shrink-0 text-ink/25" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LandingAffiliateNote() {
  return (
    <div className="rounded-2xl border border-brand/15 bg-brand/[0.04] p-4">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
        <ShieldCheck className="h-3.5 w-3.5 text-brand" aria-hidden />
        Minh bạch affiliate
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
        Một số link trên trang là link tiếp thị liên kết. Nếu bạn mua qua link, website có
        thể nhận hoa hồng từ sàn nhưng bạn không phải trả thêm.
      </p>
      <Link
        href="/chinh-sach/tiet-lo-affiliate"
        className="mt-2.5 inline-flex text-xs font-semibold text-brand transition hover:text-brand-dark"
      >
        Đọc tiết lộ affiliate →
      </Link>
    </div>
  );
}
