"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateBannerAction, type ActionState } from "@/app/actions/admin";
import type { CampaignBanner } from "@/lib/db/schema";
import { SITE } from "@/lib/site";

export function BannerEditForm({ banner }: { banner: CampaignBanner }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateBannerAction,
    {},
  );

  return (
    <details className="mt-2 rounded-md border border-line bg-paper/30 p-2">
      <summary className="cursor-pointer text-xs font-semibold text-ink/60">
        Sửa banner
      </summary>
      <form action={formAction} className="mt-2 space-y-2">
        <input type="hidden" name="id" value={banner.id} />
        <input
          name="imageUrl"
          defaultValue={banner.imageUrl}
          required
          aria-label="Ảnh banner URL"
          className="w-full rounded border border-line bg-white px-2 py-1.5 text-xs"
        />
        <input
          name="linkUrl"
          defaultValue={banner.linkUrl ?? ""}
          aria-label="Link banner"
          className="w-full rounded border border-line bg-white px-2 py-1.5 text-xs"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            name="title"
            defaultValue={banner.title ?? ""}
            placeholder="Tiêu đề"
            aria-label="Tiêu đề banner"
            className="rounded border border-line bg-white px-2 py-1.5 text-xs"
          />
          <select
            name="merchant"
            defaultValue={banner.merchant}
            aria-label="Sàn"
            className="rounded border border-line bg-white px-2 py-1.5 text-xs"
          >
            {SITE.merchants.map((merchant) => (
              <option key={merchant} value={merchant}>
                {SITE.merchantLabels[merchant]}
              </option>
            ))}
          </select>
          <input
            name="sortOrder"
            type="number"
            defaultValue={banner.sortOrder}
            aria-label="Thứ tự"
            className="rounded border border-line bg-white px-2 py-1.5 text-xs"
          />
          <label className="flex items-center gap-1.5 text-xs text-ink/60">
            <input type="checkbox" name="isActive" defaultChecked={banner.isActive} />
            Đang hiện
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1 rounded bg-brand px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            <Save className="h-3 w-3" aria-hidden />
            {pending ? "Đang lưu…" : "Lưu"}
          </button>
          {state.error && <span className="text-xs text-accent">{state.error}</span>}
          {state.ok && <span className="text-xs text-brand">{state.ok}</span>}
        </div>
      </form>
    </details>
  );
}
