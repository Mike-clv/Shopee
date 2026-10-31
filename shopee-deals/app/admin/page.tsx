import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Newspaper,
  RefreshCw,
  Ticket,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { countDealsRaw, listAllBannersRaw } from "@/lib/coupons/data";
import { listSyncLogs } from "@/lib/coupons/sync";
import {
  countCmsEntriesByStatus,
  listAuditLogs,
  listMediaAssets,
} from "@/lib/cms/data";
import { formatDateTimeVi } from "@/lib/utils";

export const metadata = {
  title: "Cpanel — Tổng quan",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <DashboardBody />
    </Suspense>
  );
}

async function DashboardBody() {
  await requireAdmin();
  const [counts, banners, cms, audit, logs, media] = await Promise.all([
    countDealsRaw(),
    listAllBannersRaw(),
    countCmsEntriesByStatus(),
    listAuditLogs(8),
    listSyncLogs(3),
    listMediaAssets(4),
  ]);

  const activeBanners = banners.filter((banner) => banner.isActive).length;
  const cards = [
    {
      href: "/admin/deals",
      icon: Ticket,
      label: "Deal đang chạy",
      value: counts.active.toLocaleString("vi-VN"),
      hint: `${counts.total.toLocaleString("vi-VN")} deal tổng cộng`,
    },
    {
      href: "/admin/blog",
      icon: Newspaper,
      label: "Bài viết CMS",
      value: cms.posts.toLocaleString("vi-VN"),
      hint: `${cms.drafts} bản nháp`,
    },
    {
      href: "/admin/pages",
      icon: FileText,
      label: "Trang nội dung",
      value: cms.pages.toLocaleString("vi-VN"),
      hint: `${cms.published} bản ghi đã đăng`,
    },
    {
      href: "/admin/banners",
      icon: ImageIcon,
      label: "Banner đang hiện",
      value: activeBanners.toLocaleString("vi-VN"),
      hint: `${media.length} media gần đây`,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ href, icon: Icon, label, value, hint }) => (
          <Link
            key={label}
            href={href}
            className="rounded-xl border border-line bg-white p-4 transition hover:border-brand/40 hover:shadow-sm"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/8 text-brand">
              <Icon className="h-4.5 w-4.5" aria-hidden />
            </span>
            <p className="mt-3 text-xs text-ink/50">{label}</p>
            <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
            <p className="mt-0.5 text-xs text-ink/45">{hint}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-ink">Việc cần làm</h2>
            <Link href="/admin/blog?status=draft" className="text-xs font-semibold text-brand">
              Xem nháp →
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink/60">
            <li className="flex items-center justify-between gap-3">
              <span>Bài viết đang nháp</span>
              <span className="font-mono text-ink">{cms.drafts}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Bài viết đã xuất bản</span>
              <span className="font-mono text-ink">{cms.published}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span>Banner đang tắt</span>
              <span className="font-mono text-ink">{banners.length - activeBanners}</span>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold text-ink">Lần sync gần nhất</h2>
            <Link href="/admin/deals" className="text-xs font-semibold text-brand">
              Quản lý deal →
            </Link>
          </div>
          {logs.length === 0 ? (
            <p className="mt-3 text-sm text-ink/45">Chưa có lần đồng bộ nào.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs">
              {logs.map((log) => (
                <li key={log.id} className="rounded-lg border border-line p-2.5">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5 text-brand" aria-hidden />
                    <span className="font-mono text-ink/50">{formatDateTimeVi(log.startedAt)}</span>
                    <span className={log.status === "success" ? "text-brand" : "text-accent"}>
                      {log.status === "success" ? "OK" : "Lỗi"}
                    </span>
                  </div>
                  <p className="mt-1 text-ink/55">
                    +{log.created} mới · ~{log.updated} sửa · {log.disabled} tắt
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-ink">Hoạt động gần đây</h2>
          <Link href="/admin/audit" className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
            Nhật ký đầy đủ <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
        {audit.length === 0 ? (
          <p className="mt-3 text-sm text-ink/45">Chưa có hoạt động biên tập nào.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line text-sm">
            {audit.map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-ink/65">{entry.summary}</span>
                <span className="font-mono text-[11px] text-ink/35">
                  {formatDateTimeVi(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
