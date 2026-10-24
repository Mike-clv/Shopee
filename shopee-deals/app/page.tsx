import type { Metadata } from "next";
import { Suspense } from "react";
import { CouponCard } from "@/lib/components/CouponCard";
import { CouponGridSkeleton } from "@/lib/components/CouponGridSkeleton";
import {
  countActiveDeals,
  listActiveDeals,
} from "@/lib/coupons/data";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mã giảm giá Shopee mới nhất hôm nay",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="space-y-8 py-6">
      <Hero />
      <Suspense fallback={<CouponGridSkeleton count={6} />}>
        <HotDeals />
      </Suspense>
      <Suspense fallback={<CouponGridSkeleton count={6} />}>
        <LatestDeals />
      </Suspense>
    </div>
  );
}

async function Hero() {
  const [featuredCount] = await Promise.all([countActiveDeals()]);
  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#ee4d2d] to-[#f97316] p-6 text-white shadow-sm">
      <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl">
        Mã giảm giá Shopee mới nhất 🔥
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/90">
        Danh sách mã được hệ thống cập nhật tự động 24/7 từ Accesstrade —
        hàng ngày có thêm mã freeship, mã giảm 500K và deal độc quyền.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <a
          href="/tim-kiem"
          className="rounded-lg bg-white px-4 py-2 font-semibold text-[#ee4d2d] shadow hover:bg-orange-50"
        >
          🔍 Tìm mã ngay
        </a>
        <span className="rounded-lg bg-white/15 px-3 py-2 font-medium">
          {featuredCount > 0 ? `${featuredCount} mã đang hoạt động` : "Đang cập nhật mã mới…"}
        </span>
      </div>
    </section>
  );
}

async function HotDeals() {
  const deals = await listActiveDeals(6);
  if (deals.length === 0) return <EmptyState />;
  return (
    <section aria-labelledby="hot-heading">
      <h2 id="hot-heading" className="mb-3 text-lg font-bold flex items-center gap-2">
        ⚡ Deal hot theo lượt dùng
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {deals.slice(0, 3).map((deal) => (
          <CouponCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}

async function LatestDeals() {
  const deals = await listActiveDeals(24);
  if (deals.length === 0) return null;
  return (
    <section aria-labelledby="latest-heading">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="latest-heading" className="text-lg font-bold">
          🆕 Mã mới nhất
        </h2>
        <p className="text-xs text-neutral-500">
          được đồng bộ theo lịch từ Accesstrade
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <CouponCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center">
      <p className="text-sm font-medium text-neutral-700">Chưa có mã nào.</p>
      <p className="mt-2 text-xs text-neutral-500">
        Vào <a className="underline" href="/admin">Admin → Sync ngay</a> để đồng bộ từ Accesstrade sau khi cấu hình access key.
      </p>
    </div>
  );
}
