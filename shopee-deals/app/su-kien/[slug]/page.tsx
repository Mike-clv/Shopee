import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { BlogCard } from "@/lib/components/BlogCard";
import { CouponCard } from "@/lib/components/CouponCard";
import { EventCountdown } from "@/lib/components/EventCountdown";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { countSearchDeals, searchDeals } from "@/lib/coupons/data";
import { getSaleEventLanding, SALE_EVENT_LANDINGS } from "@/lib/events/content";
import { OG_IMAGE } from "@/lib/seo";
import { SITE, merchantLabel, siteUrl } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return SALE_EVENT_LANDINGS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getSaleEventLanding(slug);
  if (!event) {
    return { title: "Sự kiện không tồn tại", robots: { index: false, follow: false } };
  }
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `/su-kien/${event.slug}` },
    openGraph: {
      title: event.title,
      description: event.description,
      url: `/su-kien/${event.slug}`,
      type: "website",
      images: [OG_IMAGE],
    },
  };
}

export default async function SaleEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getSaleEventLanding(slug);
  if (!event) notFound();

  const merchantDeals = await Promise.all(
    SITE.merchants.map(async (merchant) => {
      const [deals, count] = await Promise.all([
        searchDeals("", { merchant, limit: 4 }),
        countSearchDeals("", { merchant }),
      ]);
      return { merchant, deals, count };
    }),
  );
  const totalDeals = merchantDeals.reduce((sum, item) => sum + item.count, 0);
  const activeMerchants = merchantDeals.filter((item) => item.count > 0).length;

  const relatedPosts = BLOG_POSTS.filter((post) =>
    ["chuan-bi-sale-11-11", "stack-voucher-shopee-3-lop", "voucher-freeship-shopee-khong-ap-duoc"].includes(
      post.slug,
    ),
  ).slice(0, 3);

  const url = `${siteUrl()}/su-kien/${event.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.startISO,
        endDate: event.endISO,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        url,
        location: { "@type": "VirtualLocation", url },
        organizer: {
          "@type": "Organization",
          name: SITE.name,
          url: siteUrl(),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl() },
          { "@type": "ListItem", position: 2, name: "Sự kiện sale", item: `${siteUrl()}/su-kien/${event.slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: event.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "ItemList",
        name: `Deal đang chạy cho ${event.badge}`,
        numberOfItems: merchantDeals.reduce((sum, item) => sum + item.deals.length, 0),
        itemListElement: merchantDeals.flatMap(({ deals }) =>
          deals.map((deal, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl()}/ma/${deal.id}`,
            name: deal.title,
          })),
        ),
      },
    ],
  };

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        <Link href="/" className="transition hover:text-brand">
          Trang chủ
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <span className="text-ink/60">Sự kiện sale</span>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <span className="text-ink/60">11.11</span>
      </nav>

      <header className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-[#2b0a2e] via-[#7a1b6d] to-[#c026d3] p-6 text-white sm:p-9">
        <div className="pointer-events-none absolute -top-24 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase">
            <Sparkles className="h-3 w-3" aria-hidden />
            {event.badge}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl lg:text-[42px]">
            {event.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/75">
            {event.description}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <dl className="grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/15">
              {[
                { label: "Deal đang chạy", value: totalDeals.toLocaleString("vi-VN") },
                { label: "Sàn có deal", value: `${activeMerchants}/${SITE.merchants.length}` },
                { label: "Ngày sale", value: "11.11.2026" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#2b0a2e]/40 px-3 py-3">
                  <dt className="text-[9px] font-medium tracking-wide text-white/50 uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-0.5 font-display text-base font-bold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="mb-1.5 flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.12em] text-white/60 uppercase">
                <CalendarDays className="h-3 w-3" aria-hidden />
                Còn lại đến 11.11
              </p>
              <div>
                <EventCountdown startISO={event.startISO} tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-8">
          <section className="rounded-2xl border border-line bg-white p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Chuẩn bị trước khi sale bắt đầu
            </h2>
            <div className="mt-3 space-y-3">
              {event.intro.map((paragraph, index) => (
                <p key={index} className="text-[14.5px] leading-7 text-ink/65">
                  {paragraph}
                </p>
              ))}
            </div>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {event.highlights.map((item) => (
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

          <section aria-labelledby="event-deals-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="event-deals-heading"
                  className="font-display text-xl font-bold tracking-tight text-ink"
                >
                  Deal đang chạy theo sàn
                </h2>
                <p className="mt-1 text-xs text-ink/45">
                  Giá và điều kiện có thể thay đổi — kiểm tra lại trên trang đích trước khi mua.
                </p>
              </div>
              <Link
                href="/tim-kiem"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition hover:underline"
              >
                Xem tất cả deal
                <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            <div className="space-y-6">
              {merchantDeals.map(({ merchant, deals, count }) => (
                <section key={merchant} aria-labelledby={`event-${merchant}-heading`}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                    <h3
                      id={`event-${merchant}-heading`}
                      className="inline-flex items-center gap-2 font-display text-base font-bold text-ink"
                    >
                      <MerchantLogo merchant={merchant} size={22} />
                      {merchantLabel(merchant)}
                      <span className="font-mono text-[10px] font-semibold text-ink/35">
                        {count.toLocaleString("vi-VN")} deal
                      </span>
                    </h3>
                    <Link
                      href={`/san/${merchant}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:underline"
                    >
                      Hub {merchantLabel(merchant)}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  </div>
                  {deals.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {deals.map((deal) => (
                        <CouponCard key={deal.id} deal={deal} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-line bg-white px-4 py-5 text-sm text-ink/45">
                      Chưa có deal đang chạy trên {merchantLabel(merchant)}. Bạn có thể xem deal mới
                      nhất ở trang tìm kiếm.
                    </p>
                  )}
                </section>
              ))}
            </div>
          </section>

          <section aria-labelledby="event-checklist-heading">
            <h2
              id="event-checklist-heading"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Checklist săn sale 11.11
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {event.checklist.map((group) => (
                <div key={group.title} className="rounded-2xl border border-line bg-white p-4">
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold text-ink">
                    <ClipboardCheck className="h-4 w-4 text-brand" aria-hidden />
                    {group.title}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-ink/45">{group.intro}</p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] leading-6 text-ink/60">
                        <span
                          aria-hidden
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-brand/60"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="event-guide-heading" className="space-y-4">
            <h2
              id="event-guide-heading"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Kinh nghiệm săn sale
            </h2>
            {event.guide.map((block) => (
              <div key={block.title} className="rounded-2xl border border-line bg-white p-5">
                <h3 className="font-display text-base font-bold text-ink">{block.title}</h3>
                <div className="mt-2 space-y-2.5">
                  {block.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-[14px] leading-7 text-ink/60">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section aria-labelledby="event-faq-heading">
            <h2
              id="event-faq-heading"
              className="font-display text-xl font-bold tracking-tight text-ink"
            >
              Câu hỏi thường gặp về 11.11
            </h2>
            <div className="mt-4 space-y-2.5">
              {event.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-line bg-white p-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
                    {faq.question}
                    <ChevronRight
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-ink/35 transition group-open:rotate-90"
                    />
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedPosts.length > 0 && (
            <section aria-labelledby="event-posts-heading">
              <div className="mb-4 flex items-end justify-between border-b border-line pb-3">
                <h2
                  id="event-posts-heading"
                  className="font-display text-xl font-bold tracking-tight text-ink"
                >
                  Đọc thêm trước khi mua
                </h2>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-1 text-xs font-semibold text-brand transition hover:text-brand-dark"
                >
                  Tất cả bài viết
                  <ChevronRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {relatedPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="font-mono text-[9px] font-semibold tracking-[0.14em] text-ink/40 uppercase">
              Đi nhanh
            </p>
            <div className="mt-2 grid gap-1.5">
              {SITE.merchants.map((merchant) => (
                <Link
                  key={merchant}
                  href={`/san/${merchant}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink/65 transition hover:bg-brand/5 hover:text-brand"
                >
                  <span className="inline-flex items-center gap-2">
                    <MerchantLogo merchant={merchant} size={18} />
                    Deal {merchantLabel(merchant)}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              ))}
              <Link
                href="/danh-muc/freeship"
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink/65 transition hover:bg-brand/5 hover:text-brand"
              >
                Mã freeship
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link
                href="/danh-muc/voucher"
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm font-medium text-ink/65 transition hover:bg-brand/5 hover:text-brand"
              >
                Voucher mới nhất
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-brand/[0.04] p-4">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-brand" aria-hidden />
              Minh bạch affiliate
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink/50">
              Một số link trên trang là link affiliate. Khi bạn mua qua link, Sansale247 có thể
              nhận hoa hồng từ sàn; giá bạn trả không thay đổi. Chúng tôi không bán hàng hoặc xử
              lý đơn.
            </p>
            <Link
              href="/chinh-sach/tiet-lo-affiliate"
              className="mt-2 inline-flex text-[11px] font-semibold text-brand underline-offset-2 hover:underline"
            >
              Đọc chính sách affiliate
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
