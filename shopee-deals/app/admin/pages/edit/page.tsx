import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getCmsEntryById } from "@/lib/cms/data";
import { cmsPageToInput, staticSeedToInput } from "@/lib/cms/page-form";
import { getStaticPageSeed } from "@/lib/cms/registry";
import { CmsPageForm } from "@/lib/components/admin/CmsPageForm";
import { deleteCmsEntryAction, resetStaticOverrideAction } from "@/app/actions/cms";

export const metadata = {
  title: "Cpanel — Sửa trang",
  robots: { index: false, follow: false },
};

export const instant = false;

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EditPage(props: Props) {
  await requireAdmin();
  const sp = await props.searchParams;
  const id = typeof sp.id === "string" ? sp.id : "";
  const path = typeof sp.path === "string" ? sp.path : "";

  const entry = id ? await getCmsEntryById(id) : null;
  if (entry && entry.kind !== "page") notFound();

  const initial = entry
    ? cmsPageToInput(entry)
    : path
      ? (() => {
          const seed = getStaticPageSeed(path);
          return seed ? staticSeedToInput(seed) : null;
        })()
      : null;

  if (!initial) notFound();

  const isOverride = Boolean(entry && getStaticPageSeed(entry.path));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Sửa trang nội dung</h1>
          <p className="mt-1 text-sm text-ink/50">
            {entry
              ? "Bản ghi CMS — thay đổi áp dụng ngay sau khi lưu và làm mới cache."
              : "Trang đang dùng nội dung code. Lưu sẽ tạo bản ghi ghi đè."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {entry && (
            <form action={deleteCmsEntryAction}>
              <input type="hidden" name="id" value={entry.id} />
              <button className="rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                Xóa bản ghi
              </button>
            </form>
          )}
          {isOverride && (
            <form action={resetStaticOverrideAction}>
              <input type="hidden" name="path" value={entry!.path} />
              <button className="rounded-md border border-line px-3 py-2 text-sm font-semibold text-ink/60 hover:border-brand/40">
                Bỏ ghi đè, về code
              </button>
            </form>
          )}
        </div>
      </div>
      <CmsPageForm initial={initial} id={entry?.id} />
    </div>
  );
}
