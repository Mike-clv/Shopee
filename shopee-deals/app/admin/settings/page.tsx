import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { listSiteSettings } from "@/lib/cms/data";
import { normalizePromoPopup } from "@/lib/cms/promo-popup";
import { CmsSettingsForm, type SiteSettingsValues } from "@/lib/components/admin/CmsSettingsForm";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Cpanel — Cài đặt",
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-sm text-ink/40">Đang tải…</p>}>
      <SettingsBody />
    </Suspense>
  );
}

function readText(value: unknown): string {
  if (value && typeof value === "object" && "text" in value) {
    const text = (value as { text?: unknown }).text;
    return typeof text === "string" ? text : "";
  }
  return "";
}

async function SettingsBody() {
  await requireAdmin();
  const rows = await listSiteSettings();
  const byKey = new Map(rows.map((row) => [row.key, row.value]));
  const promo = normalizePromoPopup(byKey.get("promoPopup"));
  const initial: SiteSettingsValues = {
    siteName: readText(byKey.get("siteName")) || SITE.name,
    siteDescription: readText(byKey.get("siteDescription")) || SITE.description,
    contactEmail: readText(byKey.get("contactEmail")) || SITE.contactEmail,
    affiliateNote:
      readText(byKey.get("affiliateNote")) ||
      "Sansale247 có thể nhận hoa hồng khi bạn mua qua link tiếp thị liên kết; giá bạn trả không đổi.",
    promoPopupEnabled: promo.enabled,
    promoPopupImageUrl: promo.imageUrl,
    promoPopupHref: promo.href,
    promoPopupAlt: promo.alt,
    promoPopupTitle: promo.title,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Cài đặt website</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink/50">
          Thông tin chung dùng cho metadata, liên hệ, ghi chú affiliate và banner popup xuất hiện
          khi khách vào website. Nội dung landing và bài viết được quản lý ở các mục riêng.
        </p>
      </div>
      <CmsSettingsForm initial={initial} />
    </div>
  );
}
