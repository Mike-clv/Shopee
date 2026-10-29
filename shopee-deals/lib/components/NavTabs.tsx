"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame } from "lucide-react";

const TABS = [
  { href: "/", label: "Mới nhất" },
  { href: "/tim-kiem", label: "Tìm mã" },
  { href: "/blog", label: "Blog" },
] as const;

/** Client island: active-tab highlight via pathname (layout stays static). */
export function NavTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="flex items-center gap-0.5 text-[13px] font-medium md:gap-1 md:text-sm">
      {TABS.map((tab) => {
        const active =
          pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 rounded-lg px-2.5 py-2 whitespace-nowrap transition md:px-3 ${
              active
                ? "bg-brand/8 font-semibold text-brand"
                : "text-ink/65 hover:bg-brand/5 hover:text-brand"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
      <Link
        href="/tim-kiem?sort=hot"
        className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-2 whitespace-nowrap text-ink/65 transition hover:bg-brand/5 hover:text-brand md:px-3"
      >
        <Flame className="h-3.5 w-3.5 text-accent" aria-hidden />
        Mã hot
      </Link>
    </nav>
  );
}
