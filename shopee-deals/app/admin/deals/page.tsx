import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import {
  bannerImageSrc,
  countDealsRaw,
  getDealCached,
  listAllBannersRaw,
  listDealsAdmin,
} from "@/lib/coupons/data";
import { listSyncLogs } from "@/lib/coupons/sync";
import { DealForm } from "@/lib/components/DealForm";
import { BannerForm } from "@/lib/components/BannerForm";
import {
  deleteBannerAction,
  deleteDealAction,
  syncNowAction,
  toggleActiveAction,
  toggleBannerAction,
  toggleFeaturedAction,
} from "@/app/actions/admin";
import { hasAccessKey } from "@/lib/accesstrade/client";
import { formatDayVi, formatDateTimeVi } from "@/lib/utils";
import { merchantLabel } from "@/lib/site";
import { MerchantLogo } from "@/lib/components/MerchantLogo";
import type { CampaignBanner, CouponDeal } from "@/lib/db/schema";
import {
  CircleCheck,
  CircleX,
  Image as ImageIcon,
  KeyRound,
  RefreshCw,
  Ticket,
  TriangleAlert,
} from "lucide-react";

export const metadata = {
  title: "Quản trị mã giảm giá",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminPage(props: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <AdminBody searchParams={props.searchParams} />
    </Suspense>
  );
}

const PER_PAGE = 20;

async function AdminBody({
  searchParams,
}: Pick<PageProps<"/admin">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const editId = typeof sp.editId === "string" ? sp.editId : undefined;
  const q = typeof sp.q === "string" ? sp.q : "";
  const merchant = typeof sp.merchant === "string" ? sp.merchant : "";
  const status =
    sp.status === "active" || sp.status === "inactive" ? sp.status : "all";
  const page = Math.max(1, Number.parseInt(typeof sp.page === "string" ? sp.page : "", 10) || 1);

  const [banners, counts, logs, dealsPage] = await Promise.all([
    listAllBannersRaw(),
    countDealsRaw(),
    // 4 pipelines write one row each per run — show a full recent window.
    listSyncLogs(16),
    listDealsAdmin({ q: q || undefined, merchant: merchant || undefined, status, page, perPage: PER_PAGE }),
  ]);

  // The edit target may live outside the current filtered page — fall back to
  // a direct cached lookup so "Sửa" always opens the row.
  const editing = editId
    ? dealsPage.deals.find((d) => d.id === editId) ?? (await getDealCached(editId))
    : null;

  const totalPages = Math.max(1, Math.ceil(dealsPage.total / PER_PAGE));

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (merchant) params.set("merchant", merchant);
    if (status !== "all") params.set("status", status);
    if (editId) params.set("editId", editId);
    params.set("page", String(target));
    return `/admin/deals?${params.toString()}`;
  };

  return (
    <div className="space-y-6">
      <StatsRow
        total={counts.total}
        active={counts.active}
        banners={banners.filter((b) => b.isActive).length}
        hasKey={hasAccessKey()}
      />

      <SyncSection logs={logs} />

      <BannerSection banners={banners} />

      <DealForm deal={editing} />

      <section aria-label="Danh sách mã">
        <h2 className="mb-2 font-display text-xl font-semibold">
          Danh sách mã ({dealsPage.total})
        </h2>

        <DealFilters q={q} merchant={merchant} status={status} />

        {dealsPage.deals.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">
            Không có mã khớp bộ lọc. Dùng form trên hoặc bấm “Sync ngay”.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-line bg-paper text-[11px] tracking-wide text-ink/45 uppercase">
                <tr>
                  <th className="p-3">Mã / Deal</th>
                  <th className="p-3">Nguồn</th>
                  <th className="p-3">HSD</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {dealsPage.deals.map((deal) => (
                  <DealRow key={deal.id} deal={deal} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Phân trang"
            className="mt-3 flex items-center justify-center gap-2 text-sm"
          >
            {page > 1 ? (
              <a
                href={pageHref(page - 1)}
                className="rounded-md border border-line bg-white px-3 py-1.5 transition hover:border-brand/40 hover:text-brand"
              >
                ← Trước
              </a>
            ) : (
              <span className="rounded-md border border-line bg-paper px-3 py-1.5 text-ink/30">← Trước</span>
            )}
            <span className="text-ink/50">
              Trang {page}/{totalPages}
            </span>
            {page < totalPages ? (
              <a
                href={pageHref(page + 1)}
                className="rounded-md border border-line bg-white px-3 py-1.5 transition hover:border-brand/40 hover:text-brand"
              >
                Sau →
              </a>
            ) : (
              <span className="rounded-md border border-line bg-paper px-3 py-1.5 text-ink/30">Sau →</span>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}

function StatsRow({
  total,
  active,
  banners,
  hasKey,
}: {
  total: number;
  active: number;
  banners: number;
  hasKey: boolean;
}) {
  const cards = [
    {
      icon: Ticket,
      label: "Tổng số mã",
      value: String(total),
      valueClass: "text-ink",
    },
    {
      icon: CircleCheck,
      label: "Đang chạy",
      value: String(active),
      valueClass: "text-brand",
    },
    {
      icon: ImageIcon,
      label: "Banner ưu đãi",
      value: String(banners),
      valueClass: "text-brand",
    },
    {
      icon: hasKey ? KeyRound : TriangleAlert,
      label: "Accesstrade key",
      value: hasKey ? "Đã cấu hình" : "Chưa có",
      valueClass: hasKey ? "text-brand" : "text-accent",
      hint: hasKey
        ? null
        : "Thêm ACCESSTRADE_ACCESS_KEY vào .env.local để sync thật.",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value, valueClass, hint }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-lg border border-line bg-white p-4"
        >
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand/8 text-brand"
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-ink/50">{label}</p>
            <p className={`font-mono text-xl font-semibold ${valueClass}`}>{value}</p>
            {hint && <p className="mt-0.5 text-xs text-ink/45">{hint}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

type SyncLogLike = Awaited<ReturnType<typeof listSyncLogs>>[number];

function SyncSection({ logs }: { logs: SyncLogLike[] }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Đồng bộ Accesstrade</h2>
        <form action={syncNowAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c8401c]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Sync ngay
          </button>
        </form>
      </div>
      {logs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white p-4 text-sm text-ink/50">
          Chưa có lần đồng bộ nào.
        </p>
      ) : (
        <ul className="space-y-1.5 text-xs">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex flex-wrap items-center gap-2 rounded-md border border-line bg-white p-2.5"
            >
              <span
                className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-semibold ${
                  log.status === "success"
                    ? "bg-brand/8 text-brand"
                    : "bg-accent/8 text-accent"
                }`}
              >
                {log.status === "success" ? (
                  <CircleCheck className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <CircleX className="h-3.5 w-3.5" aria-hidden />
                )}
                {log.status === "success" ? "OK" : "ERR"}
              </span>
              <span className="font-mono text-ink/50">{formatDateTimeVi(log.startedAt)}</span>
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-sm bg-paper px-1.5 py-0.5 font-medium text-ink/70">
                  +{log.created} mới
                </span>
                <span className="rounded-sm bg-paper px-1.5 py-0.5 font-medium text-ink/70">
                  ~{log.updated} sửa
                </span>
                <span className="rounded-sm bg-accent/8 px-1.5 py-0.5 font-medium text-accent">
                  {log.disabled} tắt
                </span>
                {log.fetched > 0 && (
                  <span className="rounded-sm bg-paper px-1.5 py-0.5 font-medium text-ink/45">
                    ({log.fetched} lấy)
                  </span>
                )}
              </span>
              {log.message && (
                <span className="w-full truncate text-ink/40" title={log.message}>
                  {log.message}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function BannerSection({ banners }: { banners: CampaignBanner[] }) {
  return (
    <section aria-label="Quản lý banner">
      <h2 className="mb-2 font-display text-xl font-semibold">
        Banner ưu đãi ({banners.length})
      </h2>
      <BannerForm />

      {banners.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-line bg-white p-4 text-sm text-ink/50">
          Chưa có banner nào — thêm thủ công hoặc bấm “Sync ngay” để lấy banner camp từ
          Accesstrade.
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <li
              key={banner.id}
              className={`flex gap-3 rounded-lg border border-line bg-white p-3 ${
                banner.isActive ? "" : "opacity-55"
              }`}
            >
              <a
                href={banner.linkUrl ?? "#"}
                target={banner.linkUrl?.startsWith("http") ? "_blank" : undefined}
                rel={banner.linkUrl?.startsWith("http") ? "noopener nofollow" : undefined}
                className="block h-16 w-28 shrink-0 overflow-hidden rounded-md border border-line bg-paper"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImageSrc(banner)}
                  alt={banner.title ?? "Banner"}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </a>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="line-clamp-1 text-sm font-semibold text-ink">
                  {banner.title ?? banner.merchant}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/50">
                  <MerchantLogo merchant={banner.merchant} size={14} />
                  {merchantLabel(banner.merchant) || banner.merchant}
                  <span className="rounded-sm bg-paper px-1.5 py-0.5 font-medium text-ink/45">
                    {banner.source === "manual" ? "Thủ công" : "AT"}
                  </span>
                  <span
                    className={
                      banner.isActive
                        ? "rounded-sm bg-brand/8 px-1.5 py-0.5 font-medium text-brand"
                        : "rounded-sm bg-paper px-1.5 py-0.5 font-medium text-ink/45"
                    }
                  >
                    {banner.isActive ? "Hiện" : "Ẩn"}
                  </span>
                </p>
                <div className="mt-auto flex gap-1.5 pt-2 text-xs">
                  <form action={toggleBannerAction}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button
                      type="submit"
                      className="rounded border border-line px-2 py-1 transition hover:border-brand/40 hover:text-brand"
                    >
                      {banner.isActive ? "Ẩn" : "Hiện"}
                    </button>
                  </form>
                  <form action={deleteBannerAction}>
                    <input type="hidden" name="id" value={banner.id} />
                    <button
                      type="submit"
                      className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DealFilters({
  q,
  merchant,
  status,
}: {
  q: string;
  merchant: string;
  status: "active" | "inactive" | "all";
}) {
  return (
    <form
      method="get"
      action="/admin/deals"
      className="mb-3 flex flex-wrap items-end gap-2 rounded-lg border border-line bg-white p-3"
    >
      <div className="min-w-45 grow">
        <label htmlFor="filter-q" className="block text-xs font-medium text-ink/60">
          Tìm theo tên / mã
        </label>
        <input
          id="filter-q"
          name="q"
          type="text"
          defaultValue={q}
          placeholder="freeship, SHOPEE500K…"
          className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="filter-merchant" className="block text-xs font-medium text-ink/60">
          Sàn
        </label>
        <select
          id="filter-merchant"
          name="merchant"
          defaultValue={merchant}
          className="mt-1 rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
        >
          <option value="">Tất cả</option>
          {["shopee", "tiki", "lazada", "tiktokshop", "cellphones", "concung", "highlands", "oneat"].map(
            (m) => (
              <option key={m} value={m}>
                {merchantLabel(m) || m}
              </option>
            ),
          )}
        </select>
      </div>
      <div>
        <label htmlFor="filter-status" className="block text-xs font-medium text-ink/60">
          Trạng thái
        </label>
        <select
          id="filter-status"
          name="status"
          defaultValue={status}
          className="mt-1 rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang chạy</option>
          <option value="inactive">Đã tắt</option>
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        Lọc
      </button>
      {(q || merchant || status !== "all") && (
        <a
          href="/admin"
          className="rounded-md border border-line px-3 py-2 text-sm text-ink/50 transition hover:border-brand/40 hover:text-brand"
        >
          Xóa lọc
        </a>
      )}
    </form>
  );
}

function DealRow({ deal }: { deal: CouponDeal }) {
  return (
    <tr className={`transition hover:bg-paper/70 ${deal.isActive ? "" : "opacity-55"}`}>
      <td className="p-3 align-top">
        <p className="font-semibold text-ink line-clamp-1">{deal.title}</p>
        <p className="font-mono text-xs text-brand">{deal.code ?? "(deal link)"}</p>
      </td>
      <td className="p-3 align-top text-xs text-ink/50">
        {deal.source === "accesstrade" ? "AT" : deal.source === "tiktok" ? "TT Shop" : "Thủ công"}
        <br />
        <span className="inline-flex items-center gap-1">
          <MerchantLogo merchant={deal.merchant} size={14} />
          {merchantLabel(deal.merchant) || deal.merchant}
        </span>
      </td>
      <td className="p-3 align-top text-xs">{formatDayVi(deal.endTime)}</td>
      <td className="p-3 align-top text-xs">{deal.clickCount}</td>
      <td className="p-3 align-top">
        <span
          className={
            deal.isActive
              ? "rounded-sm bg-brand/8 px-2 py-0.5 text-xs font-medium text-brand"
              : "rounded-sm bg-paper px-2 py-0.5 text-xs font-medium text-ink/50"
          }
        >
          {deal.isActive ? "Đang chạy" : "Tắt"}
        </span>
        {deal.isFeatured && (
          <span className="ml-1 rounded-sm bg-accent/8 px-2 py-0.5 text-xs font-medium text-accent">
            Hot
          </span>
        )}
      </td>
      <td className="p-3 align-top">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <a
            href={`/admin/deals?editId=${deal.id}`}
            className="rounded border border-line px-2 py-1 transition hover:border-brand/40 hover:text-brand"
          >
            Sửa
          </a>
          <form action={toggleActiveAction}>
            <input type="hidden" name="id" value={deal.id} />
            <button
              type="submit"
              className="rounded border border-line px-2 py-1 transition hover:border-brand/40 hover:text-brand"
            >
              {deal.isActive ? "Tắt" : "Bật"}
            </button>
          </form>
          <form action={toggleFeaturedAction}>
            <input type="hidden" name="id" value={deal.id} />
            <button
              type="submit"
              className="rounded border border-line px-2 py-1 transition hover:border-brand/40 hover:text-brand"
            >
              {deal.isFeatured ? "Bỏ Hot" : "Hot"}
            </button>
          </form>
          <form action={deleteDealAction}>
            <input type="hidden" name="id" value={deal.id} />
            <button
              type="submit"
              className="rounded border border-red-200 px-2 py-1 text-red-600 hover:bg-red-50"
            >
              Xóa
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
