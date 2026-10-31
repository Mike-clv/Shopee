"use client";

import { useActionState } from "react";
import { saveSettingsAction, type CmsActionState } from "@/app/actions/cms";

const input =
  "mt-1 w-full rounded-md border border-line bg-paper/50 px-3 py-2 text-sm focus:border-brand/60 focus:ring-2 focus:ring-brand/10 focus:outline-none";

export type SiteSettingsValues = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  affiliateNote: string;
};

export function CmsSettingsForm({ initial }: { initial: SiteSettingsValues }) {
  const [state, action, pending] = useActionState<CmsActionState, FormData>(
    saveSettingsAction,
    {},
  );
  return (
    <form action={action} className="space-y-4">
      <section className="rounded-xl border border-line bg-white p-4">
        <h2 className="font-display text-lg font-semibold text-ink">Thông tin hiển thị</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="siteName" className="block text-xs font-medium text-ink/60">Tên website</label>
            <input id="siteName" name="siteName" defaultValue={initial.siteName} className={input} />
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-xs font-medium text-ink/60">Email liên hệ</label>
            <input id="contactEmail" name="contactEmail" type="email" defaultValue={initial.contactEmail} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="siteDescription" className="block text-xs font-medium text-ink/60">Mô tả website</label>
            <textarea id="siteDescription" name="siteDescription" rows={3} defaultValue={initial.siteDescription} className={input} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="affiliateNote" className="block text-xs font-medium text-ink/60">Ghi chú affiliate</label>
            <textarea id="affiliateNote" name="affiliateNote" rows={3} defaultValue={initial.affiliateNote} className={input} />
            <p className="mt-1 text-[11px] text-ink/40">
              Lưu vào bảng site_settings. Các vị trí đọc giá trị này sẽ được nối ở giai đoạn sau.
            </p>
          </div>
        </div>
      </section>
      <div className="flex items-center gap-3">
        <button disabled={pending} className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {pending ? "Đang lưu…" : "Lưu cài đặt"}
        </button>
        {state.error && <p className="text-xs text-red-600">{state.error}</p>}
        {state.ok && <p className="text-xs text-brand">{state.ok}</p>}
      </div>
    </form>
  );
}
