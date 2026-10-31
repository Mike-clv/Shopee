"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Newspaper,
  ScrollText,
  Settings,
  Tags,
  Ticket,
} from "lucide-react";

const ITEMS = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/deals", label: "Deal & mã", icon: Ticket },
  { href: "/admin/banners", label: "Banner", icon: Tags },
  { href: "/admin/blog", label: "Bài viết", icon: Newspaper },
  { href: "/admin/pages", label: "Trang nội dung", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Cài đặt", icon: Settings },
  { href: "/admin/audit", label: "Nhật ký", icon: ScrollText },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Điều hướng quản trị"
      className="-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:border-0 lg:px-0 lg:pb-0"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-brand text-white"
                : "text-ink/60 hover:bg-brand/[0.06] hover:text-brand"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
