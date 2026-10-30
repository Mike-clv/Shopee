import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { BlogCard } from "@/lib/components/BlogCard";
import { CopyButton } from "@/lib/components/CopyButton";
import { CouponCard } from "@/lib/components/CouponCard";
import { DealImage } from "@/lib/components/DealImage";
import { DealViewTracker } from "@/lib/components/DealViewTracker";
import { TrackedAffiliateLink } from "@/lib/components/TrackedAffiliateLink";
import { postsForDeal } from "@/lib/blog/posts";
import {
  getActiveDealByIdUncached,
  listRelatedDeals,
} from "@/lib/coupons/data";
import type { CouponDeal } from "@/lib/db/schema";
import { truncateVi, formatDayVi, formatDiscountVi, formatPriceVi } from "@/lib/utils";
import { OG_IMAGE } from "@/lib/seo";
import { isKnownMerchant, merchantLabel, siteUrl } from "@/lib/site";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { CATEGORY_SLUGS, categoryFromSlug, classifyCategory } from "@/lib/categories";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Copy,
  Globe,
  MousePointerClick,
  PiggyBank,
  ShoppingCart,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { FlashCountdown } from "@/lib/components/FlashCountdown";

// `connection()` below forces request-time rendering before the lookup, so a
// missing deal returns a real 404 instead of a streamed 200 soft-404.
export const instant = false;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata(
  props: PageProps<"/ma/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  await connection();
  if (!UUID_RE.test(id)) notFound();
  const deal = await getActiveDealByIdUncached(id);
  if (!deal) notFound();
  const title = truncateVi(deal.title, 60);
  return {
    title,
    description: truncateVi(deal.content ?? deal.title, 160),
    alternates: { canonical: `/ma/${deal.id}` },
    openGraph: {
      title,
      description: truncateVi(deal.content ?? deal.title, 160),
      images: deal.image ? [{ url: deal.image }] : [OG_IMAGE],
    },
  };
}

export default async function DealDetailPage(
  props: PageProps<"/ma/[id]">,
) {
  const { id } = await props.params;
  await connection();
  if (!UUID_RE.test(id)) notFound();
  const deal = await getActiveDealByIdUncached(id);
  if (!deal) notFound();

  return <DealBody deal={deal} />;
}

async function DealBody({ deal }: { deal: CouponDeal }) {
  const price = formatPriceVi(deal.price);
  const discount = formatDiscountVi(deal.discountRate);
  const category = deal.categories?.find(Boolean) ?? null;
  const categoryInfo = categoryFromSlug(category);
  const categorySlug = category
    ? CATEGORY_SLUGS.includes(category)
      ? category
      : classifyCategory(category)
    : null;
  const merchantHref = (merchant: string) =>
    isKnownMerchant(merchant) ? `/san/${merchant}` : `/tim-kiem?merchant=${merchant}`;
  const categoryHref = (value: string) => {
    const slug = CATEGORY_SLUGS.includes(value) ? value : classifyCategory(value);
    return slug ? `/danh-muc/${slug}` : `/tim-kiem?cate=${encodeURIComponent(value)}`;
  };
  const reading = postsForDeal(
    { merchant: deal.merchant, category: categorySlug ?? category },
    2,
  );

  // Structured data for rich results — stringified with "<" escaped so no
  // content can break out of the script tag.
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: deal.title,
    description: deal.content ?? undefined,
    image: deal.image ?? undefined,
  };
  if (deal.price != null && deal.price > 0) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "VND",
      price: deal.price,
      availability: "https://schema.org/InStock",
      url: `${siteUrl()}/ma/${deal.id}`,
    };
  }

  const related = await listRelatedDeals(deal.id, {
    category: category ?? undefined,
    merchant: deal.merchant,
    limit: 4,
  });

  return (
    <article className="py-6">
      <DealViewTracker dealId={deal.id} merchant={deal.merchant} />
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
        {deal.merchant && (
          <>
            <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
            <Link
              href={merchantHref(deal.merchant)}
              className="inline-flex items-center gap-1 transition hover:text-brand"
            >
              <MerchantLogo merchant={deal.merchant} size={14} />
              {merchantLabel(deal.merchant)}
            </Link>
          </>
        )}
        {category && (
          <>
            <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
            <Link
              href={categoryHref(category)}
              className="transition hover:text-brand"
            >
              {categoryInfo.label}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-line bg-white lg:col-span-3">
          <div className="border-b border-line p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <DealImage
                src={deal.image ?? ""}
                alt={deal.title}
                initials={(deal.merchantName ?? deal.merchant ?? "S")
                  .slice(0, 2)
                  .toUpperCase()}
                width={112}
                height={112}
                eager
                className="h-28 w-28 shrink-0 self-start rounded-xl bg-paper ring-1 ring-line"
                plateClassName="h-28 w-28 shrink-0 self-start rounded-xl bg-paper text-2xl text-ink/25"
              />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/45">
                  {deal.merchant && (
                    <Link
                      href={merchantHref(deal.merchant)}
                      className="font-medium transition hover:text-brand"
                    >
                      {merchantLabel(deal.merchant)}
                    </Link>
                  )}
                  {category && (
                    <>
                      <span aria-hidden className="text-line">
                        /
                      </span>
                      <Link
                        href={categoryHref(category)}
                        className="inline-flex items-center gap-1 transition hover:text-brand"
                      >
                        <categoryInfo.icon className="h-3 w-3" aria-hidden />
                        {categoryInfo.label}
                      </Link>
                    </>
                  )}
                </p>
                <h1 className="mt-2 font-display text-[22px] leading-snug font-bold tracking-tight text-ink sm:text-2xl">
                  {deal.title}
                </h1>
                <p className="mt-3 flex flex-wrap items-center gap-2">
                  {discount && (
                    <span className="inline-flex items-center rounded-sm bg-accent/8 px-2 py-1 font-mono text-[11px] font-bold text-accent">
                      {discount}
                    </span>
                  )}
                  {deal.merchant && (
                    <Link
                      href={merchantHref(deal.merchant)}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-line px-2 py-1 text-[11px] font-medium text-ink/55 transition hover:border-brand/40 hover:text-brand"
                    >
                      <MerchantLogo merchant={deal.merchant} size={12} />
                      Xem deal {merchantLabel(deal.merchant)}
                    </Link>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {deal.content && (
              <div className="text-sm leading-relaxed text-ink/65">
                <h2 className="mb-1.5 font-display text-base font-semibold text-ink">
                  Điều kiện ưu đãi
                </h2>
                <p className="whitespace-pre-line">{deal.content}</p>
              </div>
            )}

            <ul className="mt-5 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <li className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-ink/55">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                Bắt đầu: {formatDayVi(deal.startTime)}
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-ink/55">
                <Timer className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                Hạn dùng: {formatDayVi(deal.endTime)}
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-ink/55">
                <MousePointerClick
                  className="h-3.5 w-3.5 shrink-0 text-brand"
                  aria-hidden
                />
                Lượt dùng: {deal.clickCount.toLocaleString("vi-VN")}
              </li>
              {deal.domain && (
                <li className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-ink/55">
                  <Globe className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                  Nguồn: {deal.domain}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="self-start rounded-2xl border border-line bg-white lg:sticky lg:top-20 lg:col-span-2">
          <div className="p-5 pb-4">
            {price ? (
              <p>
                <span className="block text-[11px] text-ink/40">Giá bán</span>
                <span className="mt-1 block font-mono text-2xl font-semibold tracking-tight text-ink">
                  {price}
                </span>
              </p>
            ) : (
              <p className="inline-flex items-center gap-1.5 rounded-md bg-brand/5 px-2.5 py-1.5 text-sm font-semibold text-brand">
                <PiggyBank className="h-4 w-4" aria-hidden />
                Tiết kiệm ngay
              </p>
            )}
            {discount && (
              <p className="mt-2 font-mono text-[11px] font-bold text-accent">
                {discount} so với giá gốc
              </p>
            )}
            <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3 text-xs text-ink/50">
              <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Hạn dùng: {formatDayVi(deal.endTime) ?? "—"}
              {deal.endTime && (
                <>
                  <span aria-hidden className="text-line">
                    ·
                  </span>
                  <FlashCountdown isoEndTime={deal.endTime.toISOString()} tone="paper" />
                </>
              )}
            </p>
          </div>

          {/* Coupon ticket footer: dashed rule with punched notches. */}
          <div className="coupon-ticket rounded-b-2xl border-t border-dashed border-line bg-brand/[0.04] px-5 py-4">
            <div className="font-mono text-[9px] font-semibold tracking-[0.14em] text-ink/40 uppercase">
              {deal.code ? "Mã giảm giá" : "Nhận deal tại cửa hàng"}
            </div>
            {deal.code ? (
              <div className="mt-2">
                <CopyButton
                  code={deal.code}
                  goPath={`/go/${deal.id}`}
                  dealId={deal.id}
                  merchant={deal.merchant}
                  placement="deal_detail"
                />
              </div>
            ) : (
              <TrackedAffiliateLink
                href={`/go/${deal.id}`}
                target="_blank"
                rel="noopener nofollow"
                dealId={deal.id}
                merchant={deal.merchant}
                placement="deal_detail"
                className="group/cta mt-2 flex items-center justify-center gap-1.5 rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                Nhận ưu đãi tại website
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover/cta:translate-x-0.5"
                  aria-hidden
                />
              </TrackedAffiliateLink>
            )}
            <ol className="mt-3 grid gap-1.5 text-[11px] leading-relaxed text-ink/50">
              <li className="flex items-start gap-1.5">
                <Copy className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                Chép mã ở ô phía trên rồi mở cửa hàng.
              </li>
              <li className="flex items-start gap-1.5">
                <ShoppingCart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                Thêm sản phẩm vào giỏ hàng.
              </li>
              <li className="flex items-start gap-1.5">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                Dán mã vào ô mã giảm giá trước khi thanh toán.
              </li>
            </ol>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-ink/40">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              Link affiliate giúp duy trì website — cảm ơn bạn khi dùng link này.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-10">
          <div className="mb-4 flex items-end justify-between border-b border-line pb-3">
            <h2
              id="related-heading"
              className="font-display text-xl font-semibold tracking-tight text-ink"
            >
              Deal tương tự
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {related.map((item) => (
              <CouponCard key={item.id} deal={item} />
            ))}
          </div>
        </section>
      )}

      {reading.length > 0 && (
        <section aria-labelledby="reading-heading" className="mt-10">
          <div className="mb-4 flex items-end justify-between border-b border-line pb-3">
            <h2
              id="reading-heading"
              className="font-display text-xl font-semibold tracking-tight text-ink"
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {reading.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
