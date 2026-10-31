"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/**
 * Centered 11.11 Shopee banner. It opens once per full page load so a visitor
 * sees the campaign without the popup re-appearing on every client-side nav.
 * The CTA uses the same AccessTrade deep link as the homepage “Nguồn deal”
 * Shopee badge, so attribution stays consistent.
 */
export function PromoPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (shownRef.current) return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;

    const timer = window.setTimeout(() => {
      shownRef.current = true;
      setOpen(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-11-11-title"
        aria-describedby="promo-11-11-description"
        className="relative w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Đóng banner khuyến mãi"
          className="absolute -top-3 -right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lg transition hover:bg-paper focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          <X className="h-4.5 w-4.5" aria-hidden />
        </button>

        <a
          href={SITE.merchantHomeLinks.shopee}
          target="_blank"
          rel="sponsored noopener"
          onClick={() =>
            trackEvent("affiliate_click", {
              merchant: "shopee",
              placement: "popup_11_11",
            })
          }
          className="block overflow-hidden rounded-2xl border border-white/30 bg-white shadow-[0_28px_80px_-20px_rgba(15,23,42,0.6)] transition hover:brightness-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          aria-label="Mở Shopee 11.11 qua liên kết tiếp thị"
        >
          <Image
            src="/images/khuyen-mai/11-11-shopee-2026.jpg"
            width={1200}
            height={675}
            alt="Shopee 11.11 - Tiệc sale mở màn: siêu rẻ từ 1.000đ, triệu phụ voucher giảm đến 50%, freeship 0đ"
            sizes="(max-width: 768px) 92vw, 768px"
            className="h-auto w-full"
          />
        </a>

        <p id="promo-11-11-title" className="sr-only">
          Ưu đãi Shopee 11.11
        </p>
        <p
          id="promo-11-11-description"
          className="mt-2 text-center text-[11px] leading-relaxed text-white/70"
        >
          Liên kết tiếp thị — Sansale247 có thể nhận hoa hồng, bạn không phải trả thêm.
        </p>
      </div>
    </div>
  );
}
