import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Search,
  SearchX,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { CouponCard } from "@/lib/components/CouponCard";
import { CouponGridSkeleton } from "@/lib/components/CouponGridSkeleton";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { SearchAnalytics } from "@/lib/components/SearchAnalytics";
import { searchDeals, listTopCategories, countSearchDeals, type SearchSort } from "@/lib/coupons/data";
import { SITE, isKnownMerchant, merchantLabel } from "@/lib/site";
import { truncateVi } from "@/lib/utils";
import { categoryFromSlug } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Tìm mã giảm giá & deal đa sàn",
  description:
    "Tìm nhanh mã giảm giá Shopee và deal Tiki, TikTok Shop, Lazada: freeship, giảm giá sâu, sale chớp nhoáng…",
  alternates: { canonical: "/tim-kiem" },
};

const PAGE_LIMIT = 30;

/** One-click discovery terms rendered as links (static — safe to prerender). */
const HOT_KEYWORDS = ["freeship", "giảm 500K", "x1.5", "voucher", "freeship toàn sàn", "sale chớp nhoáng"] as const;

const SORT_OPTIONS = [
  { value: "hot", label: "Deal hot" },
  { value: "moi-nhat", label: "Mới nhất" },
  { value: "giam-sau", label: "Giảm sâu" },
  { value: "gia-thap", label: "Giá thấp đến cao" },
] as const;

type SortParam = (typeof SORT_OPTIONS)[number]["value"];

/** URL sort param → data-layer ordinal ("hot" = featured pinned default). */
function sortFromParam(value: SortParam): SearchSort | undefined {
  switch (value) {
    case "moi-nhat":
      return "new";
    case "giam-sau":
      return "discount";
    case "gia-thap":
      return "price";
    default:
      return undefined;
  }
}

type FilterState = {
  q: string;
  merchant?: string;
  category?: string;
  sort: SortParam;
  page: number;
};

async function readFilters(
  searchParams: Pick<PageProps<"/tim-kiem">, "searchParams">["searchParams"],
): Promise<FilterState> {
  const { q, merchant, cate, page, sort } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  const merchantSlug =
    typeof merchant === "string" && isKnownMerchant(merchant) ? merchant : undefined;
  const rawCate = typeof cate === "string" ? cate.trim() : "";
  // Category values come from our own synced rows (slugs or Vietnamese names);
  // only a length cap to keep URLs sane, content is bound as a real SQL param.
  const category = rawCate.length > 0 && rawCate.length <= 60 ? rawCate : undefined;
  const sortValue = SORT_OPTIONS.some((o) => o.value === sort)
    ? (sort as SortParam)
    : "hot";
  const rawPage = typeof page === "string" ? Number.parseInt(page, 10) : NaN;
  const pageNumber = Number.isNaN(rawPage) ? 1 : Math.max(1, Math.min(50, rawPage));
  return { q: query, merchant: merchantSlug, category, sort: sortValue, page: pageNumber };
}

/** Windowed page list around the current page with ellipsis gaps. */
function pagerPages(current: number, total: number): Array<number | "gap"> {
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  let previous = 0;
  for (const p of sorted) {
    if (previous && p - previous > 1) out.push("gap");
    out.push(p);
    previous = p;
  }
  return out;
}

export default function SearchPage(props: PageProps<"/tim-kiem">) {
  return (
    <div className="space-y-4 py-6">
      <header className="border-b border-line pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tìm mã &amp; deal
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/50">
          Gõ từ khóa: freeship, x1.5, giảm 500K, voucher… hoặc duyệt theo sàn / danh mục.
        </p>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1.5 text-xs">
          <span className="font-medium text-ink/40">Từ khóa hot</span>
          {HOT_KEYWORDS.map((keyword) => (
            <Link
              key={keyword}
              href={`/tim-kiem?q=${encodeURIComponent(keyword)}`}
              className="font-medium text-ink/60 underline decoration-line underline-offset-4 transition hover:text-brand hover:decoration-brand/40"
            >
              {keyword}
            </Link>
          ))}
        </div>
      </header>

      <Suspense fallback={null}>
        <SearchAnalytics />
      </Suspense>

      <Suspense fallback={<div className="shimmer h-[64px] rounded-lg border border-line bg-white" />}>
        <SearchForm searchParams={props.searchParams} />
      </Suspense>

      <Suspense fallback={<div className="shimmer h-9 rounded-md border border-line bg-white" />}>
        <MerchantStrip searchParams={props.searchParams} />
      </Suspense>

      <Suspense fallback={<div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shimmer h-8 w-24 rounded-md border border-line bg-white" />
        ))}
      </div>}>
        <CategoryChips searchParams={props.searchParams} />
      </Suspense>

      <Suspense fallback={<CouponGridSkeleton count={10} />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function SearchForm({
  searchParams,
}: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const filters = await readFilters(searchParams);
  return (
    <form
      action="/tim-kiem"
      method="GET"
      className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-2.5 sm:flex-row sm:items-center"
    >
      <label className="relative min-w-0 flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/30"
        />
        <input
          type="search"
          name="q"
          defaultValue={filters.q}
          placeholder="freeship, giảm 500K…"
          aria-label="Từ khóa tìm kiếm"
          className="h-11 w-full rounded-full border border-line bg-muted py-2.5 pr-4 pl-9 text-sm text-ink transition placeholder:text-ink/30 focus:border-brand/50 focus:bg-white focus:outline-none"
        />
      </label>
      {filters.category && <input type="hidden" name="cate" value={filters.category} />}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:w-auto">
        <label className="relative">
          <Store
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/30"
          />
          <select
            name="merchant"
            defaultValue={filters.merchant ?? ""}
            aria-label="Lọc theo sàn"
            className="h-11 w-full appearance-none rounded-full border border-line bg-white py-2.5 pr-8 pl-9 text-sm text-ink/70 transition focus:border-brand/50 focus:outline-none"
          >
            <option value="">Tất cả sàn</option>
            {SITE.merchants.map((merchant) => (
              <option key={merchant} value={merchant}>
                {SITE.merchantLabels[merchant]}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink/30"
          />
        </label>
        <label className="relative">
          <ArrowUpDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/30"
          />
          <select
            name="sort"
            defaultValue={filters.sort}
            aria-label="Sắp xếp kết quả"
            className="h-11 w-full appearance-none rounded-full border border-line bg-white py-2.5 pr-8 pl-9 text-sm text-ink/70 transition focus:border-brand/50 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-ink/30"
          />
        </label>
      </div>
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        <Search className="h-4 w-4" aria-hidden />
        Tìm
      </button>
    </form>
  );
}

async function MerchantStrip({
  searchParams,
}: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const filters = await readFilters(searchParams);
  const hrefFor = (merchant?: string) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (merchant) params.set("merchant", merchant);
    if (filters.category) params.set("cate", filters.category);
    if (filters.sort !== "hot") params.set("sort", filters.sort);
    const qs = params.toString();
    return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
  };

  return (
    <nav aria-label="Lọc theo sàn" className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-medium text-ink/40">Sàn</span>
      <Link
        href={hrefFor()}
        aria-current={!filters.merchant ? "page" : undefined}
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
          !filters.merchant
            ? "border-brand bg-brand text-white"
            : "border-line bg-white text-ink/60 hover:border-brand/40 hover:text-brand"
        }`}
      >
        Tất cả sàn
      </Link>
      {SITE.merchants.map((merchant) => {
        const active = filters.merchant === merchant;
        return (
          <Link
            key={merchant}
            href={hrefFor(merchant)}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border py-1 pr-3 pl-1.5 text-[13px] font-medium transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink/70 hover:border-brand/40 hover:text-brand"
            }`}
          >
            <MerchantLogo merchant={merchant} size={18} />
            {SITE.merchantLabels[merchant]}
          </Link>
        );
      })}
    </nav>
  );
}

async function CategoryChips({
  searchParams,
}: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const filters = await readFilters(searchParams);
  // Counts are scoped to the current merchant filter so a chip badge always
  // matches what clicking it will actually show (chips yielding zero deals
  // under the current merchant are dropped instead of teasing empty pages).
  const top = await listTopCategories(12, filters.merchant);
  if (top.length === 0) return null;

  const hrefFor = (cate?: string) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.merchant) params.set("merchant", filters.merchant);
    if (cate) params.set("cate", cate);
    const qs = params.toString();
    return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
  };

  return (
    <nav aria-label="Danh mục deal" className="flex flex-wrap items-center gap-1.5">
      <Link
        href={hrefFor()}
        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
          filters.category
            ? "border-line bg-white text-ink/60 hover:border-brand/40 hover:text-brand"
            : "border-brand bg-brand text-white"
        }`}
      >
        Tất cả
      </Link>
      {top.map(({ slug, count }) => {
        const info = categoryFromSlug(slug);
        const active = filters.category === slug;
        return (
          <Link
            key={slug}
            href={hrefFor(slug)}
            title={`${count} deal ${filters.merchant ? `trên ${merchantLabel(filters.merchant)}` : "tất cả sàn"}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${
              active
                ? "border-brand bg-brand text-white"
                : "border-line bg-white text-ink/60 hover:border-brand/40 hover:text-brand"
            }`}
          >
            <info.icon className="h-3.5 w-3.5" aria-hidden />
            {info.label}
            <span className="font-mono text-[10px] text-ink/35">{count}</span>
          </Link>
        );
      })}
    </nav>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const filters = await readFilters(searchParams);
  const { q: query, merchant, category, page } = filters;

  if (!query && !merchant && !category) {
    const popular = await listTopCategories(8);
    return (
      <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
        <ShoppingBag aria-hidden className="mx-auto h-8 w-8 text-brand/30" strokeWidth={1.5} />
        <p className="mt-3 font-display text-xl font-semibold text-ink">
          Khám phá deal đa sàn
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-ink/50">
          Nhập từ khóa (freeship, giảm 500K, voucher…) hoặc chạm nhanh một danh mục đang hot.
        </p>
        {popular.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {popular.map(({ slug, count }) => {
              const info = categoryFromSlug(slug);
              return (
                <Link
                  key={slug}
                  href={`/tim-kiem?cate=${encodeURIComponent(slug)}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper/50 px-3 py-2 text-xs font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
                >
                  <info.icon className="h-3.5 w-3.5" aria-hidden />
                  {info.label}
                  <span className="font-mono text-[10px] text-ink/35">{count}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const sort = sortFromParam(filters.sort);
  const [total, deals] = await Promise.all([
    countSearchDeals(query, { merchant, category }),
    searchDeals(query, {
      merchant,
      category,
      sort,
      limit: PAGE_LIMIT,
      page,
    }),
  ]);

  if (deals.length === 0) {
    const categoryLabel = category ? categoryFromSlug(category).label : null;
    const merchantName = merchant ? merchantLabel(merchant) : null;
    const hrefWithoutMerchant = (() => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (category) p.set("cate", category);
      const qs = p.toString();
      return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
    })();
    const hrefWithoutCategory = (() => {
      const p = new URLSearchParams();
      if (query) p.set("q", query);
      if (merchant) p.set("merchant", merchant);
      const qs = p.toString();
      return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
    })();

    return (
      <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
        <SearchX aria-hidden className="mx-auto h-8 w-8 text-brand/30" strokeWidth={1.5} />
        <p className="mt-3 font-display text-xl font-semibold text-ink">
          Chưa có deal nào khớp bộ lọc
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink/50">
          {query && (
            <>
              từ khóa “{query}”{category || merchant ? " · " : ""}
            </>
          )}
          {category && (
            <>
              danh mục <strong className="font-semibold text-ink/70">{categoryLabel}</strong>
              {merchant ? " · " : ""}
            </>
          )}
          {merchant && (
            <>
              sàn <strong className="font-semibold text-ink/70">{merchantName}</strong>
            </>
          )}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {category && merchant && (
            <Link
              href={hrefWithoutMerchant}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c8401c]"
            >
              Xem “{categoryLabel}” trên tất cả sàn
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
          {merchant && (
            <Link
              href={hrefWithoutCategory}
              className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
            >
              Deal {merchantName} mọi danh mục
            </Link>
          )}
          <Link
            href="/tim-kiem"
            className="rounded-md border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
          >
            Xóa bộ lọc
          </Link>
        </div>
        <p className="mt-4 text-xs text-ink/40">
          Mẹo: thử “freeship”, “giảm 500K”, “voucher” — hoặc bỏ sàn để xem nhiều deal hơn.
        </p>
      </div>
    );
  }

  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (merchant) params.set("merchant", merchant);
    if (category) params.set("cate", category);
    if (filters.sort !== "hot") params.set("sort", filters.sort);
    params.set("page", String(p));
    return `/tim-kiem?${params.toString()}`;
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));
  const showPager = page > 1 || page < totalPages;

  /** Hrefs that remove exactly one active filter (for dismissible chips). */
  const hrefWithout = (drop: "q" | "merchant" | "category") => {
    const params = new URLSearchParams();
    if (drop !== "q" && query) params.set("q", query);
    if (drop !== "merchant" && merchant) params.set("merchant", merchant);
    if (drop !== "category" && category) params.set("cate", category);
    const qs = params.toString();
    return qs ? `/tim-kiem?${qs}` : "/tim-kiem";
  };

  return (
    <section aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <ListFilter aria-hidden className="h-4 w-4 shrink-0 text-brand" />
        <p className="min-w-0 flex-1 text-sm text-ink/55">
          {query && (
            <>
              Từ khóa “{query}”
              {category || merchant ? " · " : ""}
            </>
          )}
          {category && (
            <>
              Danh mục{" "}
              <strong className="font-semibold text-ink">
                {categoryFromSlug(category).label}
              </strong>
              {merchant ? " · " : ""}
            </>
          )}
          {merchant && (
            <>
              Sàn{" "}
              <strong className="font-semibold text-ink">{merchantLabel(merchant)}</strong>
              {" · "}
            </>
          )}
          <strong className="font-mono font-semibold text-ink">
            {total.toLocaleString("vi-VN")}
          </strong>{" "}
          deal (trang {page}/{Math.max(1, Math.ceil(total / PAGE_LIMIT))})
        </p>
        {query && (
          <Link
            href={hrefWithout("q")}
            className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/55 transition hover:border-accent/40 hover:text-accent"
            aria-label={`Bỏ từ khóa ${query}`}
          >
            “{truncateVi(query, 24)}”
            <X className="h-3 w-3" aria-hidden />
          </Link>
        )}
        {merchant && (
          <Link
            href={hrefWithout("merchant")}
            className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/55 transition hover:border-accent/40 hover:text-accent"
            aria-label={`Bỏ lọc sàn ${merchantLabel(merchant)}`}
          >
            {merchantLabel(merchant)}
            <X className="h-3 w-3" aria-hidden />
          </Link>
        )}
        {category && (
          <Link
            href={hrefWithout("category")}
            className="inline-flex shrink-0 items-center gap-1 rounded-sm border border-line bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/55 transition hover:border-accent/40 hover:text-accent"
            aria-label={`Bỏ lọc danh mục ${categoryFromSlug(category).label}`}
          >
            {categoryFromSlug(category).label}
            <X className="h-3 w-3" aria-hidden />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {deals.map((deal) => (
          <CouponCard key={deal.id} deal={deal} />
        ))}
      </div>

      {showPager ? (
        <nav
          aria-label="Phân trang"
          className="mt-6 flex flex-wrap items-center justify-center gap-1.5"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="inline-flex items-center gap-0.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
            >
              <ChevronLeft aria-hidden className="h-3.5 w-3.5" />
              Trước
            </Link>
          ) : (
            <span
              aria-hidden
              className="inline-flex items-center gap-0.5 rounded-md px-3 py-2 text-sm text-ink/25"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Trước
            </span>
          )}
          {pagerPages(page, totalPages).map((item, index) =>
            item === "gap" ? (
              <span key={`gap-${index}`} aria-hidden className="px-1 font-mono text-sm text-ink/30">
                …
              </span>
            ) : item === page ? (
              <span
                key={item}
                aria-current="page"
                className="rounded-full bg-brand px-3.5 py-2 font-mono text-sm font-semibold text-white"
              >
                {item}
              </span>
            ) : (
              <Link
                key={item}
                href={pageHref(item)}
                className="rounded-full border border-line bg-white px-3.5 py-2 font-mono text-sm font-medium text-ink/70 transition hover:border-brand/40 hover:text-brand"
              >
                {item}
              </Link>
            ),
          )}
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="inline-flex items-center gap-0.5 rounded-full border border-brand/30 bg-brand/5 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/10"
            >
              Sau
              <ChevronRight aria-hidden className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <span
              aria-hidden
              className="inline-flex items-center gap-0.5 rounded-md px-3 py-2 text-sm text-ink/25"
            >
              Sau
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          )}
        </nav>
      ) : null}
    </section>
  );
}
