import Link from "next/link";
import { ChevronRight, Clock3, FileText, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { TRUST_LINKS, type LegalSection as Section } from "@/lib/legal/content";

function formatUpdated(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function LegalPage({
  title,
  description,
  updated,
  current,
  children,
}: {
  title: string;
  description: string;
  updated: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <div className="py-8">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-xs text-ink/45"
      >
        <Link href="/" className="transition hover:text-brand">
          Trang chủ
        </Link>
        <ChevronRight aria-hidden className="h-3 w-3 text-ink/20" />
        <span className="text-ink/60">{title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <header className="border-b border-line pb-6">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Thông tin website
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/55">
              {description}
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-ink/35">
              <Clock3 className="h-3 w-3" aria-hidden />
              Cập nhật: {formatUpdated(updated)}
            </p>
          </header>

          <div className="mt-6 space-y-7">{children}</div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-label="Thông tin website"
            className="rounded-2xl border border-line bg-white p-4"
          >
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-ink/45 uppercase">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Thông tin website
            </p>
            <ul className="mt-3 space-y-1">
              {TRUST_LINKS.map((link) => {
                const active = link.href === current;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "block rounded-lg bg-brand/8 px-2.5 py-1.5 text-xs font-semibold text-brand"
                          : "block rounded-lg px-2.5 py-1.5 text-xs text-ink/55 transition hover:bg-ink/[0.03] hover:text-brand"
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-4 rounded-2xl border border-brand/15 bg-brand/[0.04] p-4">
            <p className="text-xs font-semibold text-ink">Cần báo link lỗi?</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/55">
              Gửi URL và mô tả ngắn qua trang liên hệ để website kiểm tra và cập nhật.
            </p>
            <Link
              href="/lien-he"
              className="mt-2.5 inline-flex text-xs font-semibold text-brand transition hover:text-brand-dark"
            >
              Liên hệ ngay →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function LegalSection({ section }: { section: Section }) {
  return (
    <section>
      <h2 className="font-display text-[20px] font-bold tracking-tight text-ink">
        {section.heading}
      </h2>
      {section.paragraphs?.map((paragraph, index) => (
        <p
          key={index}
          className="mt-3 text-[14.5px] leading-7 text-ink/65"
        >
          {paragraph}
        </p>
      ))}
      {section.bullets ? (
        <ul className="mt-3 space-y-2.5">
          {section.bullets.map((item, index) => (
            <li
              key={index}
              className="flex gap-2.5 text-[14.5px] leading-7 text-ink/65"
            >
              <span
                aria-hidden
                className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-brand/60"
              />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
