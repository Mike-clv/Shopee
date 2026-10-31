import { Suspense } from "react";
import { Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { listMediaAssets } from "@/lib/cms/data";
import { CmsMediaForm } from "@/lib/components/admin/CmsMediaForm";
import { deleteMediaAction } from "@/app/actions/cms";

export const metadata = {
  title: "Cpanel — Media",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminMediaPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <MediaBody />
    </Suspense>
  );
}

async function MediaBody() {
  await requireAdmin();
  const assets = await listMediaAssets(200);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Media</h1>
        <p className="mt-1 text-sm text-ink/50">
          Thư viện ảnh dùng cho bài viết, banner và landing. Lưu URL để tái sử dụng, tránh nhập lại.
        </p>
      </div>

      <CmsMediaForm />

      <section>
        <h2 className="mb-2 font-display text-xl font-semibold text-ink">Thư viện ({assets.length})</h2>
        {assets.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-white p-6 text-center text-sm text-ink/50">
            Chưa có media nào.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <li key={asset.id} className="rounded-lg border border-line bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.alt} loading="lazy" className="aspect-video w-full rounded-md border border-line object-cover" />
                <p className="mt-2 line-clamp-1 text-sm font-medium text-ink">{asset.alt || "Không có alt"}</p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-ink/40">{asset.url}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-ink/40">
                  <span>{asset.width && asset.height ? `${asset.width}×${asset.height}` : "—"}</span>
                  <form action={deleteMediaAction}>
                    <input type="hidden" name="id" value={asset.id} />
                    <button className="inline-flex items-center gap-1 text-red-600 hover:underline">
                      <Trash2 className="h-3 w-3" aria-hidden /> Xóa
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
