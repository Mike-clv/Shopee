import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { listAllDealsRaw } from "@/lib/coupons/data";
import { listSyncLogs } from "@/lib/coupons/sync";
import { DealForm } from "@/lib/components/DealForm";
import {
  deleteDealAction,
  syncNowAction,
  toggleActiveAction,
  toggleFeaturedAction,
} from "@/app/actions/admin";
import { hasAccessKey } from "@/lib/accesstrade/client";
import { formatDayVi, formatDateTimeVi } from "@/lib/utils";
import type { CouponDeal } from "@/lib/db/schema";

export const metadata = {
  title: "Quản trị mã giảm giá",
  robots: { index: false, follow: false },
};

export default function AdminPage(props: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-neutral-400">Đang tải…</p>}>
      <AdminBody searchParams={props.searchParams} />
    </Suspense>
  );
}

async function AdminBody({
  searchParams,
}: Pick<PageProps<"/admin">, "searchParams">) {
  await requireAdmin();
  const sp = await searchParams;
  const editId = typeof sp.editId === "string" ? sp.editId : undefined;

  const [deals, logs] = await Promise.all([
    listAllDealsRaw(),
    listSyncLogs(8),
  ]);
  const editing = editId ? deals.find((d) => d.id === editId) ?? null : null;
  const activeCount = deals.filter((d) => d.isActive).length;

  return (
    <div className="space-y-6">
      <StatsRow total={deals.length} active={activeCount} hasKey={hasAccessKey()} />

      <SyncSection logs={logs} />

      <DealForm deal={editing} />

      <section aria-label="Danh sách mã">
        <h2 className="mb-2 text-lg font-bold">Danh sách mã ({deals.length})</h2>
        {deals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500">
            Chưa có mã. Dùng form trên hoặc bấm “Sync ngay”.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="p-3">Mã / Deal</th>
                  <th className="p-3">Nguồn</th>
                  <th className="p-3">HSD</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {deals.map((deal) => (
                  <DealRow key={deal.id} deal={deal} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatsRow({ total, active, hasKey }: { total: number; active: number; hasKey: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-xs text-neutral-500">Tổng số mã</p>
        <p className="text-2xl font-extrabold">{total}</p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-xs text-neutral-500">Đang chạy</p>
        <p className="text-2xl font-extrabold text-green-600">{active}</p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <p className="text-xs text-neutral-500">Accesstrade key</p>
        <p className={`text-2xl font-extrabold ${hasKey ? "text-green-600" : "text-amber-500"}`}>
          {hasKey ? "✓ Đã cấu hình" : "— Chưa có"}
        </p>
        {!hasKey && (
          <p className="mt-1 text-xs text-neutral-500">
            Thêm ACCESSTRADE_ACCESS_KEY vào .env.local để sync thật.
          </p>
        )}
      </div>
    </div>
  );
}

type SyncLogLike = Awaited<ReturnType<typeof listSyncLogs>>[number];

function SyncSection({ logs }: { logs: SyncLogLike[] }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">Đồng bộ Accesstrade</h2>
        <form action={syncNowAction}>
          <button
            type="submit"
            className="rounded-lg bg-[#ee4d2d] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#d73211]"
          >
            ⟳ Sync ngay
          </button>
        </form>
      </div>
      {logs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-sm text-neutral-500">
          Chưa có lần đồng bộ nào.
        </p>
      ) : (
        <ul className="space-y-1.5 text-xs">
          {logs.map((log) => (
            <li
              key={log.id}
              className="flex flex-wrap items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2.5"
            >
              <span
                className={
                  log.status === "success"
                    ? "font-semibold text-green-600"
                    : "font-semibold text-red-600"
                }
              >
                {log.status === "success" ? "OK" : "ERR"}
              </span>
              <span className="text-neutral-500">{formatDateTimeVi(log.startedAt)}</span>
              <span className="text-neutral-700">
                +{log.created} mới / ~{log.updated} sửa / ✕{log.disabled} tắt
                {log.fetched > 0 ? ` (${log.fetched} lấy)` : ""}
              </span>
              {log.message && (
                <span className="w-full truncate text-neutral-400" title={log.message}>
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

function DealRow({ deal }: { deal: CouponDeal }) {
  return (
    <tr className={deal.isActive ? "" : "opacity-55"}>
      <td className="p-3 align-top">
        <p className="font-semibold text-neutral-900 line-clamp-1">{deal.title}</p>
        <p className="font-mono text-xs text-[#ee4d2d]">{deal.code ?? "(deal link)"}</p>
      </td>
      <td className="p-3 align-top text-xs text-neutral-500">
        {deal.source === "accesstrade" ? "AT" : "Thủ công"}
        <br />
        {deal.merchant}
      </td>
      <td className="p-3 align-top text-xs">{formatDayVi(deal.endTime)}</td>
      <td className="p-3 align-top text-xs">{deal.clickCount}</td>
      <td className="p-3 align-top">
        <span
          className={
            deal.isActive
              ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
              : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500"
          }
        >
          {deal.isActive ? "Đang chạy" : "Tắt"}
        </span>
        {deal.isFeatured && (
          <span className="ml-1 rounded-full bg-[#ee4d2d]/10 px-2 py-0.5 text-xs font-medium text-[#ee4d2d]">
            Hot
          </span>
        )}
      </td>
      <td className="p-3 align-top">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <a
            href={`/admin?editId=${deal.id}`}
            className="rounded border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
          >
            Sửa
          </a>
          <form action={toggleActiveAction}>
            <input type="hidden" name="id" value={deal.id} />
            <button
              type="submit"
              className="rounded border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
            >
              {deal.isActive ? "Tắt" : "Bật"}
            </button>
          </form>
          <form action={toggleFeaturedAction}>
            <input type="hidden" name="id" value={deal.id} />
            <button
              type="submit"
              className="rounded border border-neutral-200 px-2 py-1 hover:bg-neutral-50"
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
