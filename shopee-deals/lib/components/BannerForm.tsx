"use client";

import { useActionState } from "react";
import { ImagePlus } from "lucide-react";
import { addBannerAction, type ActionState } from "@/app/actions/admin";
import { SITE } from "@/lib/site";

/** Admin form for manually adding a banner creative (URL-based). */
export function BannerForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    addBannerAction,
    {},
  );

  return (
    <form action={formAction} className="rounded-lg border border-line bg-white p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="banner-image" className="block text-xs font-medium text-ink/60">
            Ảnh banner (URL) *
          </label>
          <input
            id="banner-image"
            name="imageUrl"
            type="text"
            required
            placeholder="https://static.dimuadi.vn/… hoặc https://statics.oneat.org/…"
            className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="banner-link" className="block text-xs font-medium text-ink/60">
            Link khi bấm banner (bỏ trống = trang chủ)
          </label>
          <input
            id="banner-link"
            name="linkUrl"
            type="text"
            placeholder="https://go.isclix.com/… hoặc /tim-kiem?merchant=shopee"
            className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="banner-title" className="block text-xs font-medium text-ink/60">
            Tiêu đề (alt ảnh)
          </label>
          <input
            id="banner-title"
            name="title"
            type="text"
            placeholder="Shopee Sale 11.11"
            className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="banner-merchant" className="block text-xs font-medium text-ink/60">
            Sàn
          </label>
          <select
            id="banner-merchant"
            name="merchant"
            defaultValue="shopee"
            className="mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm transition focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none"
          >
            {SITE.merchants.map((merchant) => (
              <option key={merchant} value={merchant}>
                {SITE.merchantLabels[merchant]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c8401c] disabled:opacity-60"
        >
          <ImagePlus className="h-4 w-4" aria-hidden />
          {pending ? "Đang lưu…" : "Thêm banner"}
        </button>
        {state.error && <p className="text-sm text-accent">{state.error}</p>}
        {state.ok && <p className="text-sm text-brand">{state.ok}</p>}
      </div>
    </form>
  );
}
