import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { getCmsEntryById, listCmsEntries } from "@/lib/cms/data";
import { cmsPostToInput, staticPostToInput } from "@/lib/cms/post-form";
import { CmsPostForm } from "@/lib/components/admin/CmsPostForm";
import { deleteCmsEntryAction } from "@/app/actions/cms";

export const metadata = {
  title: "Cpanel — Sửa bài viết",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function EditPostPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const sp = await props.searchParams;
  const id = typeof sp.id === "string" ? sp.id : "";
  const slug = typeof sp.slug === "string" ? sp.slug : "";

  let entry = id ? await getCmsEntryById(id) : null;
  if (!entry && slug) {
    const rows = await listCmsEntries({ kind: "post", q: slug, limit: 100 });
    entry = rows.find((row) => row.slug === slug) ? await getCmsEntryById(rows.find((row) => row.slug === slug)!.id) : null;
  }
  if (entry && entry.kind !== "post") notFound();

  const initial = entry
    ? cmsPostToInput(entry)
    : slug
      ? BLOG_POSTS.find((post) => post.slug === slug)
        ? staticPostToInput(BLOG_POSTS.find((post) => post.slug === slug)!)
        : null
      : null;

  if (!initial) notFound();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Sửa bài viết</h1>
          <p className="mt-1 text-sm text-ink/50">
            {entry ? "Bản ghi CMS" : "Bài code sẵn có — lưu sẽ tạo bản ghi ghi đè."}
          </p>
        </div>
        {entry && (
          <form action={deleteCmsEntryAction}>
            <input type="hidden" name="id" value={entry.id} />
            <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Xóa bản ghi CMS
            </button>
          </form>
        )}
      </div>
      <CmsPostForm initial={initial} id={entry?.id} />
    </div>
  );
}
