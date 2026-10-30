import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock3, HelpCircle, MessageCircle, Plus } from "lucide-react";
import {
  LandingAffiliateNote,
  LandingLinkList,
  LandingSidebarCard,
} from "@/lib/components/LandingPage";
import { FAQ_GROUPS, FAQ_ITEMS, FAQ_UPDATED } from "@/lib/faq/content";
import { TRUST_LINKS } from "@/lib/legal/content";
import { OG_IMAGE } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Câu hỏi thường gặp",
  description:
    "Giải đáp về mã giảm giá, link affiliate, dữ liệu cá nhân, báo lỗi và cách Sansale247 vận hành.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Câu hỏi thường gặp — Sansale247",
    description:
      "Giải đáp về mã giảm giá, link affiliate, dữ liệu cá nhân và cách báo lỗi deal.",
    url: "/faq",
    type: "website",
    images: [OG_IMAGE],
  },
};

function formatUpdated(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl()}/faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        <Link href="/" className="transition hover:text-brand">
          Trang chủ
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <span className="text-ink/60">Câu hỏi thường gặp</span>
      </nav>

      <header className="border-b border-line pb-6">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
          <HelpCircle className="h-3 w-3" aria-hidden />
          Hỏi đáp
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-4xl">
          Câu hỏi thường gặp
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/55">
          Giải đáp nhanh về mã giảm giá, link affiliate, dữ liệu cá nhân và cách
          báo lỗi deal trên Sansale247.
        </p>
        <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ink/35">
          <Clock3 className="h-3 w-3" aria-hidden />
          Cập nhật: {formatUpdated(FAQ_UPDATED)}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-8">
          {FAQ_GROUPS.map((group) => (
            <section key={group.title}>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink">
                {group.title}
              </h2>
              {group.description ? (
                <p className="mt-2 text-sm leading-6 text-ink/50">
                  {group.description}
                </p>
              ) : null}
              <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
                {group.items.map((item) => (
                  <details key={item.question} className="group px-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-ink transition hover:text-brand [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <Plus
                        aria-hidden
                        className="h-4 w-4 shrink-0 text-ink/30 transition group-open:rotate-45 group-open:text-brand"
                      />
                    </summary>
                    <p className="pb-4 text-[14px] leading-7 text-ink/60">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}

          <div className="rounded-2xl border border-brand/15 bg-brand/[0.04] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <MessageCircle className="h-4 w-4 text-brand" aria-hidden />
              Chưa tìm thấy câu trả lời?
            </p>
            <p className="mt-1.5 text-sm leading-6 text-ink/55">
              Gửi câu hỏi kèm URL cụ thể qua trang liên hệ. Website sẽ phản hồi
              trong thời gian sớm nhất.
            </p>
            <Link
              href="/lien-he"
              className="mt-3 inline-flex text-sm font-semibold text-brand transition hover:text-brand-dark"
            >
              Liên hệ Sansale247 →
            </Link>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <LandingSidebarCard title="Bắt đầu nhanh">
            <LandingLinkList
              links={[
                { href: "/tim-kiem", label: "Tìm mã giảm giá" },
                { href: "/san/shopee", label: "Deal Shopee" },
                { href: "/danh-muc/freeship", label: "Mã freeship" },
                { href: "/blog", label: "Mẹo săn deal" },
              ]}
            />
          </LandingSidebarCard>

          <LandingSidebarCard title="Thông tin website">
            <LandingLinkList
              links={TRUST_LINKS.filter((link) => link.href !== "/faq")}
            />
          </LandingSidebarCard>

          <LandingAffiliateNote />
        </aside>
      </div>
    </div>
  );
}
