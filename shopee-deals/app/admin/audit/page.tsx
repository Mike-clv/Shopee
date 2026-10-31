import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { listAuditLogs } from "@/lib/cms/data";

export const metadata = {
  title: "Cpanel — Nhật ký",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminAuditPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <AuditBody />
    </Suspense>
  );
}

const ACTION_LABEL: Record<string, string> = {
  create: "Tạo",
  update: "Cập nhật",
  delete: "Xóa",
  reset: "Bỏ ghi đè",
};

async function AuditBody() {
  await requireAdmin();
  const logs = await listAuditLogs(100);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Nhật ký hoạt động</h1>
        <p className="mt-1 text-sm text-ink/50">
          100 thao tác gần nhất trên CMS: ai sửa, sửa gì và thời điểm. Dùng để truy vết khi nội
          dung công khai bị thay đổi ngoài ý muốn.
        </p>
      </div>

      {logs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">
          Chưa có hoạt động nào.
        </p>
      ) : (
        <ol className="space-y-2">
          {logs.map((log) => (
            <li key={log.id} className="rounded-lg border border-line bg-white p-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded bg-brand/8 px-2 py-0.5 font-semibold text-brand">
                  {ACTION_LABEL[log.action] ?? log.action}
                </span>
                <span className="font-mono text-ink/40">{log.entity}</span>
                <span className="ml-auto font-mono text-ink/35">
                  {new Intl.DateTimeFormat("vi-VN", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(log.createdAt)}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-ink">{log.summary}</p>
              <p className="mt-0.5 text-[11px] text-ink/40">Người thao tác: {log.actor}</p>
              {(log.before != null || log.after != null) && (
                <details className="mt-2 text-[11px] text-ink/50">
                  <summary className="cursor-pointer select-none">Xem dữ liệu thay đổi</summary>
                  <pre className="mt-2 max-h-56 overflow-auto rounded bg-paper p-2 text-[10px] leading-relaxed">
                    {JSON.stringify({ before: log.before, after: log.after }, null, 2)}
                  </pre>
                </details>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
