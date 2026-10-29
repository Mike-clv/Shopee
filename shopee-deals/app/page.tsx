import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Gift,
  Percent,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  TicketPercent,
  Timer,
  Truck,
  Zap,
} from "lucide-react";
import {
  countActiveDeals,
  countDealsPerMerchant,
  listActiveDeals,
  listTopCategories,
} from "@/lib/coupons/data";
import { SITE, merchantLabel } from "@/lib/site";
import { categoryFromSlug } from "@/lib/categories";
import { formatDiscountVi, formatPriceVi, truncateVi } from "@/lib/utils";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { DealImage } from "@/lib/components/DealImage";
import { FlashCountdown } from "@/lib/components/FlashCountdown";
import {
  PromoBanners,
  PromoBannersSkeleton,
  PromoWide,
} from "@/lib/components/PromoBanners";
import { BlogCard } from "@/lib/components/BlogCard";
import { CouponCard } from "@/lib/components/CouponCard";
import { BLOG_POSTS } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "Mã giảm giá Shopee, Tiki, Lazada & TikTok Shop mới nhất",
  description:
    "Tổng hợp mã giảm giá, voucher và deal hot từ Shopee, Tiki, Lazada, TikTok Shop — cập nhật tự động 24/7, kèm hạn dùng và điều kiện rõ ràng.",
  alternates: { canonical: "/" },
};

const countFmt = new Intl.NumberFormat("vi-VN");

export default function HomePage() {
  return (
    <div className="space-y-6 py-6">
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<HotDealsSkeleton />}>
        <HotDeals />
      </Suspense>
      <Suspense fallback={<RailSkeleton />}>
        <FlashDeals />
      </Suspense>
      <Suspense fallback={<PromoBannersSkeleton />}>
        <PromoBanners />
      </Suspense>
      <Suspense fallback={<StatsSkeleton />}>
        <StatStrip />
      </Suspense>
      <Suspense fallback={<CategorySkeleton />}>
        <CategoryNav />
      </Suspense>
      <Suspense fallback={<HotDealsSkeleton />}>
        <MerchantSections />
      </Suspense>
      <PromoWide />
      <BlogTeaser />
    </div>
  );
}

async function Hero() {
  const activeCount = await countActiveDeals();
  return (
    <section className="market-hero relative overflow-hidden rounded-2xl border border-line">
      <div className="relative mx-auto max-w-3xl px-4 py-12 text-center sm:py-16 lg:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold text-ink/55 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand" aria-hidden />
          Cập nhật 24/7 · {countFmt.format(activeCount)} deal đang mở
        </span>
        <h1 className="mt-4 font-display text-3xl leading-tight font-bold text-ink sm:text-4xl lg:text-5xl">
          Săn <span className="title-shimmer">Mã Giảm Giá</span> &amp;
          <br />
          Ưu Đãi Nổi Bật Mỗi Ngày
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/55 sm:text-lg">
          Tổng hợp voucher Shopee, Lazada, Tiki và TikTok Shop — kèm hạn dùng,
          điều kiện và mã code rõ ràng trước khi bạn bấm mua.
        </p>

        <form
          action="/tim-kiem"
          method="GET"
          role="search"
          className="relative mx-auto mt-7 max-w-lg"
        >
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-ink/35"
          />
          <input
            type="search"
            name="q"
            aria-label="Tìm mã giảm giá"
            placeholder="Thử “freeship”, “voucher”, “sách”…"
            className="h-[52px] w-full rounded-full border border-line bg-white pr-28 pl-11 text-base text-ink shadow-sm transition placeholder:text-ink/35 focus:border-brand/50 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute top-1.5 right-1.5 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <QuickChip href="/tim-kiem?q=voucher" icon={Percent} label="Mã giảm giá" />
          <QuickChip href="/tim-kiem?sort=hot" icon={Flame} label="Mã hot" />
          <QuickChip href="/tim-kiem?q=freeship" icon={Truck} label="Miễn phí vận chuyển" />
          <QuickChip href="/tim-kiem?sort=giam-sau" icon={Zap} label="Siêu sale" />
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:mt-12 sm:gap-x-9">
          <span className="text-xs font-medium text-ink/35">Nguồn deal</span>
          {SITE.merchants.map((merchant) => (
            <Link
              key={merchant}
              href={`/tim-kiem?merchant=${merchant}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/50 transition hover:text-brand"
            >
              <MerchantLogo merchant={merchant} size={18} />
              {SITE.merchantLabels[merchant]}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickChip({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Percent;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/85 px-3.5 py-2 text-xs font-medium text-ink/65 shadow-sm transition hover:-translate-y-0.5 hover:border-brand/30 hover:text-brand"
    >
      <Icon className="h-3.5 w-3.5 text-brand" aria-hidden />
      {label}
    </Link>
  );
}

async function StatStrip() {
  const [totalActive, merchantCounts] = await Promise.all([
    countActiveDeals(),
    countDealsPerMerchant(),
  ]);
  const shopee = merchantCounts.shopee ?? 0;
  const productDeals = Math.max(0, totalActive - shopee);
  const stats = [
    { label: "Deal đang hoạt động", value: countFmt.format(totalActive), icon: Gift },
    { label: "Mã & voucher Shopee", value: countFmt.format(shopee), icon: TicketPercent },
    { label: "Deal đa sàn", value: countFmt.format(productDeals), icon: ShoppingBag },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="max-sm:[&:nth-child(odd):last-child]:col-span-2 bg-white px-4 py-4 sm:px-5"
        >
          <dt className="flex items-center gap-1.5 text-[11px] text-ink/45">
            <Icon className="h-3.5 w-3.5 text-brand" aria-hidden />
            {label}
          </dt>
          <dd className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

async function FlashDeals() {
  const pool = await listActiveDeals({ limit: 40 });
  const flashDeals = pool
    .filter((deal) => deal.endTime != null)
    .sort((a, b) => (b.discountRate ?? 0) - (a.discountRate ?? 0))
    .slice(0, 6);
  if (flashDeals.length === 0) return null;
  return (
    <section aria-labelledby="flash-heading" className="py-2">
      <SectionHead
        id="flash-heading"
        title="Deal chớp nhoáng"
        icon={<Flame className="h-5 w-5 text-accent" aria-hidden />}
        meta={`${flashDeals.length} deal có hạn`}
        href="/tim-kiem?sort=giam-sau"
        linkLabel="Deal giảm sâu"
      />
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {flashDeals.map((deal) => (
          <FlashDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}

function FlashDealCard({
  deal,
}: {
  deal: Awaited<ReturnType<typeof listActiveDeals>>[number];
}) {
  const price = formatPriceVi(deal.price);
  const discount = formatDiscountVi(deal.discountRate);
  return (
    <Link
      href={`/ma/${deal.id}`}
      className="group flex min-w-[235px] flex-1 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg"
    >
      <span className="relative block">
        <DealImage
          src={deal.image ?? ""}
          alt={deal.title}
          initials={(merchantLabel(deal.merchant) || deal.merchantName || "S")
            .slice(0, 2)
            .toUpperCase()}
          width={480}
          height={260}
          className="h-32 w-full rounded-none bg-muted"
          plateClassName="h-32 w-full rounded-none text-3xl"
        />
        {discount && (
          <span className="absolute top-2 left-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {discount}
          </span>
        )}
        <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold tracking-wide text-brand uppercase shadow-sm">
          <Flame className="h-3 w-3" aria-hidden />
          Flash
        </span>
      </span>
      <span className="flex flex-1 flex-col p-3.5">
        <span className="text-[10px] font-medium text-ink/40">
          {merchantLabel(deal.merchant)}
        </span>
        <span className="mt-0.5 line-clamp-2 font-display text-sm leading-snug font-semibold text-ink transition group-hover:text-brand">
          {truncateVi(deal.title, 70)}
        </span>
        {price && (
          <span className="mt-1.5 text-sm font-bold text-brand">{price}</span>
        )}
        <span className="mt-2 flex items-center gap-1.5 text-xs text-ink/50">
          <Timer className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
          {deal.endTime && <FlashCountdown isoEndTime={deal.endTime.toISOString()} tone="paper" />}
        </span>
        <span className="mt-auto pt-3">
          <span className="flex h-9 items-center justify-center gap-1.5 rounded-full bg-brand px-3 text-xs font-semibold text-white transition group-hover:bg-brand-dark">
            Lấy deal
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </span>
      </span>
    </Link>
  );
}

async function HotDeals() {
  const deals = await listActiveDeals({ limit: 6 });
  if (deals.length === 0) return <EmptyState />;
  return (
    <section aria-labelledby="hot-heading" className="py-2">
      <SectionHead
        id="hot-heading"
        title="Mã giảm giá hot hôm nay"
        icon={<Flame className="h-5 w-5 text-accent" aria-hidden />}
        meta="Cập nhật 24/7"
        href="/tim-kiem?sort=hot"
      />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {deals.slice(0, 4).map((deal) => (
          <CouponCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}

async function CategoryNav() {
  const categories = await listTopCategories(12);
  if (categories.length === 0) return null;
  return (
    <section aria-labelledby="category-heading" className="py-2">
      <SectionHead
        id="category-heading"
        title="Duyệt theo danh mục"
        icon={<Tag className="h-5 w-5 text-brand" aria-hidden />}
        href="/tim-kiem"
        linkLabel="Tất cả danh mục"
      />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {categories.map((category) => {
          const info = categoryFromSlug(category.slug);
          const Icon = info.icon;
          return (
            <Link
              key={category.slug}
              href={`/tim-kiem?cate=${encodeURIComponent(category.slug)}`}
              className="flex min-h-[132px] flex-col items-center justify-center gap-2 rounded-2xl border border-line bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="line-clamp-2 text-xs font-semibold text-ink">
                {info.label}
              </span>
              <span className="text-[10px] text-ink/40">{countFmt.format(category.count)} deal</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

async function MerchantSections() {
  const counts = await countDealsPerMerchant();
  const groups = await Promise.all(
    SITE.merchants.map(async (merchant) => ({
      merchant,
      deals: await listActiveDeals({ merchant, limit: 6 }),
    })),
  );
  const filled = groups.filter((group) => group.deals.length > 0);
  if (filled.length === 0) return null;
  return (
    <div className="space-y-7">
      {filled.map(({ merchant, deals }) => (
        <section key={merchant} aria-labelledby={`merchant-${merchant}`}>
          <SectionHead
            id={`merchant-${merchant}`}
            title={`Deal ${merchantLabel(merchant)}`}
            icon={<MerchantLogo merchant={merchant} size={26} />}
            meta={`${countFmt.format(counts[merchant] ?? deals.length)} deal`}
            href={`/tim-kiem?merchant=${merchant}`}
          />
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {deals.slice(0, 4).map((deal, i) => (
              <CouponCard
                key={deal.id}
                deal={deal}
                // Mobile shows 2x2 (4th card fills the row); desktop keeps the original single row of 3.
                className={i === 3 ? "hidden max-sm:flex" : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BlogTeaser() {
  return (
    <section aria-labelledby="blog-heading" className="py-2">
      <SectionHead
        id="blog-heading"
        title="Mẹo săn deal từ blog"
        icon={<Sparkles className="h-5 w-5 text-brand" aria-hidden />}
        href="/blog"
        linkLabel="Tất cả bài viết"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {BLOG_POSTS.slice(0, 3).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

function SectionHead({
  id,
  title,
  icon,
  meta,
  href,
  linkLabel = "Xem tất cả",
}: {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  meta?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2
        id={id}
        className="flex min-w-0 items-center gap-2 text-xl font-bold font-display text-ink sm:text-2xl"
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
        {meta && (
          <span className="hidden shrink-0 text-xs font-medium text-ink/40 sm:inline">
            {meta}
          </span>
        )}
      </h2>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand transition hover:underline"
        >
          {linkLabel}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white py-14 text-center">
      <ShoppingBag className="h-9 w-9 text-ink/20" aria-hidden />
      <p className="font-medium text-ink/60">Chưa có deal nào.</p>
      <Link href="/admin" className="text-sm font-medium text-brand hover:underline">
        Vào trang quản trị để sync
      </Link>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="market-hero rounded-2xl border border-line">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="shimmer mx-auto h-6 w-48 rounded-full" />
        <div className="shimmer mx-auto mt-5 h-10 w-full max-w-xl rounded-lg" />
        <div className="shimmer mx-auto mt-2 h-10 w-2/3 rounded-lg" />
        <div className="shimmer mx-auto mt-5 h-4 w-80 rounded" />
        <div className="shimmer mx-auto mt-7 h-[52px] w-full max-w-lg rounded-full" />
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 bg-white px-5 py-4">
          <div className="shimmer h-3 w-24 rounded" />
          <div className="shimmer h-7 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

function RailSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="shimmer h-64 min-w-[235px] flex-1 rounded-2xl border border-line bg-white"
        />
      ))}
    </div>
  );
}

function HotDealsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-line bg-white"
          aria-hidden
        >
          <div className="shimmer h-24 w-full rounded-none sm:h-32" />
          <div className="space-y-1.5 p-2">
            <div className="shimmer h-2.5 w-16 rounded" />
            <div className="shimmer h-3 w-3/4 rounded" />
            <div className="shimmer h-3 w-12 rounded" />
            <div className="shimmer h-8 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="shimmer h-[132px] rounded-2xl border border-line bg-white" />
      ))}
    </div>
  );
}
