import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, CalendarDays, FileText, Map, Store, Tag } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { CATEGORY_SLUGS, categoryFromSlug } from "@/lib/categories";
import { listActiveDeals } from "@/lib/coupons/data";
import { SALE_EVENT_LANDINGS } from "@/lib/events/content";
import { LEGAL_PAGES } from "@/lib/legal/content";
import { OG_IMAGE } from "@/lib/seo";
import { SITE, merchantLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Danh mục toàn bộ trang quan trọng trên Sansale247: deal theo sàn, danh mục, bài viết và chính sách.",
  alternates: { canonical: "/sitemap" },
  openGraph: {
    title: "Sitemap — Sansale247",
    description:
      "Danh mục toàn bộ trang quan trọng trên Sansale247.",
    url: "/sitemap",
    type: "website",
    images: [OG_IMAGE],
  },
};

function LinkList({
  links,
}: {
  links: Array<{ href: string; label: string; meta?: string }>;
}) {
  return (
    <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-ink/65 transition hover:bg-ink/[0.02] hover:text-brand"
          >
            <span className="min-w-0">{link.label}</span>
            {link.meta ? (
              <span className="shrink-0 font-mono text-[10px] text-ink/35">
                {link.meta}
              </span>
            ) : (
              <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-ink/25" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function HtmlSitemapPage() {
  const deals = await listActiveDeals({ limit: 60 });

  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        <Link href="/" className="transition hover:text-brand">
          Trang chủ
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <span className="text-ink/60">Sitemap</span>
      </nav>

      <header className="border-b border-line pb-6">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
          <Map className="h-3 w-3" aria-hidden />
          Điều hướng
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-4xl">
          Sitemap
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/55">
          Danh mục các trang quan trọng trên Sansale247. Dùng trang này để tìm
          nhanh deal theo sàn, danh mục, bài viết và chính sách.
        </p>
      </header>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FileText className="h-4 w-4 text-brand" aria-hidden />
            Trang chính
          </h2>
          <LinkList
            links={[
              { href: "/", label: "Trang chủ" },
              { href: "/tim-kiem", label: "Tìm mã giảm giá" },
              { href: "/blog", label: "Blog" },
              { href: "/faq", label: "Câu hỏi thường gặp" },
              { href: "/ve-chung-toi", label: "Về Sansale247" },
              { href: "/lien-he", label: "Liên hệ" },
            ]}
          />
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <CalendarDays className="h-4 w-4 text-brand" aria-hidden />
            Sự kiện sale
          </h2>
          <LinkList
            links={SALE_EVENT_LANDINGS.map((event) => ({
              href: `/su-kien/${event.slug}`,
              label: event.badge,
            }))}
          />
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Store className="h-4 w-4 text-brand" aria-hidden />
            Deal theo sàn
          </h2>
          <LinkList
            links={SITE.merchants.map((merchant) => ({
              href: `/san/${merchant}`,
              label: `Deal ${merchantLabel(merchant)}`,
            }))}
          />
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Tag className="h-4 w-4 text-brand" aria-hidden />
            Deal theo danh mục
          </h2>
          <LinkList
            links={CATEGORY_SLUGS.map((slug) => ({
              href: `/danh-muc/${slug}`,
              label: categoryFromSlug(slug).label,
            }))}
          />
        </section>

        <section>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FileText className="h-4 w-4 text-brand" aria-hidden />
            Chính sách & thông tin
          </h2>
          <LinkList
            links={LEGAL_PAGES.map((page) => ({
              href: `/chinh-sach/${page.slug}`,
              label: page.title,
            }))}
          />
        </section>

        <section className="md:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <FileText className="h-4 w-4 text-brand" aria-hidden />
            Bài viết
          </h2>
          <LinkList
            links={BLOG_POSTS.map((post) => ({
              href: `/blog/${post.slug}`,
              label: post.title,
              meta: post.tag.label,
            }))}
          />
        </section>

        <section className="md:col-span-2">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Tag className="h-4 w-4 text-brand" aria-hidden />
            Deal mới cập nhật
          </h2>
          {deals.length > 0 ? (
            <LinkList
              links={deals.map((deal) => ({
                href: `/ma/${deal.id}`,
                label: deal.title,
                meta: merchantLabel(deal.merchant),
              }))}
            />
          ) : (
            <p className="mt-3 rounded-xl border border-line bg-white p-4 text-sm text-ink/50">
              Chưa có deal đang hoạt động. Bạn có thể xem lại sau hoặc dùng trang
              tìm kiếm.
            </p>
          )}
          <p className="mt-3 text-xs text-ink/40">
            Danh sách đầy đủ hơn có trong{" "}
            <Link href="/sitemap.xml" className="font-semibold text-brand hover:text-brand-dark">
              sitemap XML
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
