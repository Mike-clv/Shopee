import { Suspense } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { listCmsEntries } from "@/lib/cms/data";
import { formatDayVi } from "@/lib/utils";

export const metadata = {
  title: "Cpanel — Bài viết",
  robots: { index: false, follow: false },
};

export const instant = false;

type AdminBlogProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function AdminBlogPage(props: AdminBlogProps) {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <BlogBody searchParams={props.searchParams} />
    </Suspense>
  );
}

async function BlogBody({ searchParams }: AdminBlogProps) {
  await requireAdmin();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const status = sp.status === "draft" || sp.status === "published" ? sp.status : "";
  const cmsPosts = await listCmsEntries({ kind: "post", limit: 100, q: q || undefined, status: status || undefined });
  const cmsBySlug = new Map(cmsPosts.map((post) => [post.slug, post]));

  const staticRows = BLOG_POSTS.filter((post) => {
    if (q && !`${post.title} ${post.slug}`.toLowerCase().includes(q)) return false;
    if (status === "draft") return false;
    return true;
  }).map((post) => ({
    key: `static-${post.slug}`,
    title: post.title,
    slug: post.slug,
    status: "published" as const,
    updated: new Date(post.updated),
    editHref: `/admin/blog/edit?slug=${encodeURIComponent(post.slug)}`,
    source: "code" as const,
    override: cmsBySlug.get(post.slug),
  }));

  const dbRows = cmsPosts
    .filter((post) => !BLOG_POSTS.some((staticPost) => staticPost.slug === post.slug))
    .map((post) => ({
      key: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      updated: post.updatedAt,
      editHref: `/admin/blog/edit?id=${post.id}`,
      source: "cms" as const,
      override: undefined,
    }));

  const rows = [...staticRows, ...dbRows];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Bài viết</h1>
          <p className="mt-1 text-sm text-ink/50">
            Bài code sẵn có thể ghi đè bằng CMS; bài mới lưu hoàn toàn trong DB.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Bài mới
        </Link>
      </div>

      <form method="get" action="/admin/blog" className="flex flex-wrap items-end gap-2 rounded-lg border border-line bg-white p-3">
        <div className="min-w-48 grow">
          <label htmlFor="blog-q" className="block text-xs font-medium text-ink/60">Tìm bài</label>
          <input id="blog-q" name="q" defaultValue={q} placeholder="tiêu đề hoặc slug" className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm" />
        </div>
        <div>
          <label htmlFor="blog-status" className="block text-xs font-medium text-ink/60">Trạng thái</label>
          <select id="blog-status" name="status" defaultValue={status} className="mt-1 rounded-md border border-line bg-paper/50 px-3 py-2 text-sm">
            <option value="">Tất cả</option>
            <option value="published">Xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
        <button className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Lọc</button>
      </form>

      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-line bg-paper text-[11px] uppercase tracking-wide text-ink/45">
            <tr>
              <th className="p-3">Bài viết</th>
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
                  <p className="font-mono text-[11px] text-ink/35">/blog/{row.slug}</p>
                </td>
                <td className="p-3 text-xs text-ink/55">
                  {row.override ? "CMS ghi đè" : row.source === "code" ? "Code" : "CMS"}
                </td>
                <td className="p-3 font-mono text-xs text-ink/50">{formatDayVi(row.updated)}</td>
                <td className="p-3">
                  <span className={row.status === "published" ? "rounded bg-brand/8 px-2 py-0.5 text-xs font-medium text-brand" : "rounded bg-paper px-2 py-0.5 text-xs font-medium text-ink/50"}>
                    {row.status === "published" ? "Xuất bản" : "Nháp"}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={row.editHref} className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                    <Pencil className="h-3.5 w-3.5" aria-hidden /> Sửa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">Không có bài khớp bộ lọc.</p>}
    </div>
  );
}
