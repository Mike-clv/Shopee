import type { Metadata } from "next";
import { Suspense } from "react";
import { CouponCard } from "@/lib/components/CouponCard";
import { CouponGridSkeleton } from "@/lib/components/CouponGridSkeleton";
import { searchDeals } from "@/lib/coupons/data";

export const metadata: Metadata = {
  title: "Tìm mã giảm giá Shopee",
  description:
    "Tìm nhanh mã giảm giá Shopee theo từ khóa: freeship, giảm giá_vk, sale…",
  alternates: { canonical: "/tim-kiem" },
};

export default function SearchPage(props: PageProps<"/tim-kiem">) {
  return (
    <div className="space-y-4 py-6">
      <header>
        <h1 className="text-2xl font-extrabold">Tìm mã giảm giá 🔍</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Gõ từ khóa: freeship, x1.5, giảm 500K, voucher…
        </p>
      </header>

      {/* Plain form — search works even without JavaScript. */}
      <form action="/tim-kiem" method="GET" className="flex gap-2">
        <input
          type="search"
          name="q"
          placeholder="freeship, giảm 500K…"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#ee4d2d] focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#ee4d2d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d73211]"
        >
          Tìm
        </button>
      </form>

      <Suspense fallback={<CouponGridSkeleton count={3} />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/tim-kiem">, "searchParams">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";
  if (!query) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
        Nhập từ khóa để bắt đầu tìm Coupon phù hợp.
      </p>
    );
  }

  const deals = await searchDeals(query);
  if (deals.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
        Không tìm thấy mã nào cho{" "}
        <strong className="text-neutral-800">“{query}”</strong>. Hãy thử từ
        khóa khác.
      </p>
    );
  }

  return (
    <section aria-live="polite">
      <p className="mb-3 text-sm text-neutral-600">
        {deals.length} kết quả cho{" "}
        <strong className="text-neutral-900">“{query}”</strong>
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <CouponCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}
