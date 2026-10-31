import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { bannerImageSrc, listAllBannersRaw } from "@/lib/coupons/data";
import { deleteBannerAction, toggleBannerAction } from "@/app/actions/admin";
import { BannerForm } from "@/lib/components/BannerForm";
import { BannerEditForm } from "@/lib/components/admin/BannerEditForm";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import { merchantLabel } from "@/lib/site";

export const metadata = {
  title: "Cpanel — Banner",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminBannersPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <BannersBody />
    </Suspense>
  );
}

async function BannersBody() {
  await requireAdmin();
  const banners = await listAllBannersRaw();
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Banner & creative</h1>
        <p className="mt-1 text-sm text-ink/50">
          Banner hiển thị trên trang chủ. Có thể thêm thủ công hoặc lấy từ Accesstrade.
        </p>
      </div>

      <BannerForm />

      <section aria-label="Danh sách banner">
        <h2 className="mb-2 font-display text-xl font-semibold text-ink">
          Danh sách banner ({banners.length})
        </h2>
        {banners.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">
            Chưa có banner nào.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {banners.map((banner) => (
              <li
                key={banner.id}
                className={`rounded-lg border border-line bg-white p-3 ${
                  banner.isActive ? "" : "opacity-60"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImageSrc(banner)}
                  alt={banner.title ?? "Banner"}
                  loading="lazy"
                  className="aspect-video w-full rounded-md border border-line object-cover"
                />
                <div className="mt-2 flex items-center gap-1.5 text-xs text-ink/50">
                  <MerchantLogo merchant={banner.merchant} size={14} />
                  {merchantLabel(banner.merchant) || banner.merchant}
                  <span className="rounded bg-paper px-1.5 py-0.5">
                    {banner.source === "manual" ? "Thủ công" : "AT"}
                  </span>
                  <span
                    className={
                      banner.isActive
                        ? "rounded bg-brand/8 px-1.5 py-0.5 text-brand"
                        : "rounded bg-paper px-1.5 py-0.5"
                    }
                  >
                    {banner.isActive ? "Hiện" : "Ẩn"}
                  </span>
                  <span className="ml-auto font-mono">#{banner.sortOrder}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
                  {banner.title ?? banner.merchant}
                </p>
                <div className="mt-2 flex gap-1.5 text-xs">
                  <form action={toggleBannerAction}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button className="rounded border border-line px-2 py-1 hover:border-brand/40 hover:text-brand">
                      {banner.isActive ? "Ẩn" : "Hiện"}
                    </button>
                  </form>
                  <form action={deleteBannerAction}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50">
                      Xóa
                    </button>
                  </form>
                </div>
                <BannerEditForm banner={banner} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
