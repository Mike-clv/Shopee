import { Suspense } from "react";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listCmsEntries } from "@/lib/cms/data";
import { listStaticPageDefinitions } from "@/lib/cms/registry";

export const metadata = {
  title: "Cpanel — Trang nội dung",
  robots: { index: false, follow: false },
};

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function AdminPagesPage(props: Props) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <PagesBody searchParams={props.searchParams} />
    </Suspense>
  );
}

async function PagesBody({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const type = typeof sp.type === "string" ? sp.type : "";
  const dbPages = await listCmsEntries({ kind: "page", limit: 200 });
  const byPath = new Map(dbPages.map((row) => [row.path, row]));
  const staticRows = listStaticPageDefinitions().map((page) => ({
    key: page.path,
    title: page.title,
    path: page.path,
    pageType: page.pageType,
    updated: byPath.get(page.path)?.updatedAt ?? null,
    status: byPath.get(page.path)?.status ?? ("published" as const),
    override: byPath.get(page.path),
    source: "code" as const,
  }));
  const dbOnlyRows = dbPages
    .filter((row) => !staticRows.some((item) => item.path === row.path))
    .map((row) => ({
      key: row.id,
      title: row.title,
      path: row.path,
      pageType: "custom",
      updated: row.updatedAt,
      status: row.status,
      override: row,
      source: "cms" as const,
    }));
  const rows = [...staticRows, ...dbOnlyRows].filter((row) => {
    if (type && row.pageType !== type) return false;
    if (q && !`${row.title} ${row.path}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const types = Array.from(new Set([...staticRows, ...dbOnlyRows].map((row) => row.pageType))).sort();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Trang nội dung</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink/50">
          Ghi đè nội dung landing sàn, danh mục, sự kiện và trang chính sách. Chưa có bản ghi
          thì trang dùng nội dung code sẵn.
        </p>
      </div>

      <form method="get" action="/admin/pages" className="flex flex-wrap items-end gap-2 rounded-lg border border-line bg-white p-3">
        <div className="min-w-52 grow">
          <label htmlFor="pages-q" className="block text-xs font-medium text-ink/60">Tìm trang</label>
          <input id="pages-q" name="q" defaultValue={q} placeholder="tiêu đề hoặc đường dẫn" className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="pages-type" className="block text-xs font-medium text-ink/60">Loại</label>
          <select id="pages-type" name="type" defaultValue={type} className="mt-1 rounded-md border border-line bg-paper/50 px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            {types.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Lọc</button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-paper text-[11px] uppercase tracking-wide text-ink/45">
            <tr>
              <th className="p-3">Trang</th>
              <th className="p-3">Loại</th>
              <th className="p-3">Nguồn</th>
              <th className="p-3">Cập nhật</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Sửa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="p-3">
                  <p className="font-medium text-ink">{row.title}</p>
                  <p className="font-mono text-[11px] text-ink/35">{row.path}</p>
                </td>
                <td className="p-3 text-xs text-ink/55">{row.pageType}</td>
                <td className="p-3 text-xs text-ink/55">
                  {row.source === "cms" ? "CMS" : row.override ? "CMS ghi đè" : "Code"}
                </td>
                <td className="p-3 font-mono text-xs text-ink/50">
                  {row.updated ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short" }).format(row.updated) : "—"}
                </td>
                <td className="p-3">
                  <span className={row.status === "published" ? "rounded bg-brand/8 px-2 py-0.5 text-xs font-medium text-brand" : "rounded bg-paper px-2 py-0.5 text-xs font-medium text-ink/50"}>
                    {row.status === "published" ? "Công khai" : "Nháp"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Link href={row.override ? `/admin/pages/edit?id=${row.override.id}` : `/admin/pages/edit?path=${encodeURIComponent(row.path)}`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                      <Pencil className="h-3.5 w-3.5" aria-hidden /> Sửa
                    </Link>
                    <Link href={row.path} target="_blank" className="inline-flex items-center gap-1 text-xs text-ink/45 hover:text-brand">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Xem
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">Không có trang khớp bộ lọc.</p>}
    </div>
  );
}
