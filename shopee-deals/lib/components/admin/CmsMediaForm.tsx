"use client";

import { useActionState } from "react";
import { addMediaAction, type CmsActionState } from "@/app/actions/cms";

const input =
  "mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none";

export function CmsMediaForm() {
  const [state, action, pending] = useActionState<CmsActionState, FormData>(
    addMediaAction,
    {},
  );
  return (
    <form action={action} className="rounded-xl border border-line bg-white p-4">
      <h2 className="font-display text-lg font-semibold text-ink">Thêm media bằng URL</h2>
      <p className="mt-1 text-xs text-ink/45">
        MVP dùng URL hoặc đường dẫn nội bộ. File tải lên sẽ bổ sung sau khi chọn nơi lưu trữ.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="media-url" className="block text-xs font-medium text-ink/60">URL ảnh *</label>
          <input id="media-url" name="url" required placeholder="https://… hoặc /images/…" className={input} />
        </div>
        <div>
          <label htmlFor="media-alt" className="block text-xs font-medium text-ink/60">Alt text</label>
          <input id="media-alt" name="alt" placeholder="Mô tả ảnh" className={input} />
        </div>
        <div>
          <label htmlFor="media-caption" className="block text-xs font-medium text-ink/60">Chú thích</label>
          <input id="media-caption" name="caption" className={input} />
        </div>
        <div>
          <label htmlFor="media-width" className="block text-xs font-medium text-ink/60">Rộng (px)</label>
          <input id="media-width" name="width" type="number" min={1} className={input} />
        </div>
        <div>
          <label htmlFor="media-height" className="block text-xs font-medium text-ink/60">Cao (px)</label>
          <input id="media-height" name="height" type="number" min={1} className={input} />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Đang lưu…" : "Thêm media"}
        </button>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        {state.ok && <p className="text-xs text-brand">{state.ok}</p>}
      </div>
    </form>
  );
}
