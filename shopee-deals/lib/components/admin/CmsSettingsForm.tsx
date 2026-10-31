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
  promoPopupEnabled: boolean;
  promoPopupImageUrl: string;
  promoPopupHref: string;
  promoPopupAlt: string;
  promoPopupTitle: string;
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

      <section className="rounded-xl border border-line bg-white p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Banner popup khi vào web</h2>
            <p className="mt-1 max-w-2xl text-xs text-ink/45">
              Hiện ngay khi khách mở trang public, tự ẩn ở trang admin/login. Bấm ra ngoài hoặc nút X
              để đóng.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              name="promoPopupEnabled"
              defaultChecked={initial.promoPopupEnabled}
              className="h-4 w-4 rounded border-line text-brand focus:ring-brand"
            />
            Bật popup
          </label>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="promoPopupImageUrl" className="block text-xs font-medium text-ink/60">
              Ảnh banner (URL hoặc đường dẫn nội bộ)
            </label>
            <input
              id="promoPopupImageUrl"
              name="promoPopupImageUrl"
              defaultValue={initial.promoPopupImageUrl}
              placeholder="https://… hoặc /images/khuyen-mai/…"
              className={input}
            />
            <p className="mt-1 text-[11px] text-ink/40">
              Khuyến nghị ảnh ngang tỉ lệ 16:9 (ví dụ 1200×675) để popup hiển thị đẹp trên mobile.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="promoPopupHref" className="block text-xs font-medium text-ink/60">
              Link khi bấm banner
            </label>
            <input
              id="promoPopupHref"
              name="promoPopupHref"
              defaultValue={initial.promoPopupHref}
              placeholder="https://go.isclix.com/… hoặc /tim-kiem?merchant=shopee"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="promoPopupTitle" className="block text-xs font-medium text-ink/60">
              Tiêu đề ẩn (accessible)
            </label>
            <input
              id="promoPopupTitle"
              name="promoPopupTitle"
              defaultValue={initial.promoPopupTitle}
              placeholder="Ưu đãi Shopee 11.11"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="promoPopupAlt" className="block text-xs font-medium text-ink/60">
              Alt text của ảnh
            </label>
            <input
              id="promoPopupAlt"
              name="promoPopupAlt"
              defaultValue={initial.promoPopupAlt}
              placeholder="Mô tả ngắn nội dung banner"
              className={input}
            />
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
