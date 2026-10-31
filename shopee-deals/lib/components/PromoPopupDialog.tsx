"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { PromoPopupSettings } from "@/lib/cms/promo-popup";

/**
 * Centered entrance banner configured from Cpanel. It opens once per full page
 * load so a visitor sees the campaign without the popup re-appearing on every
 * client-side nav. The CTA uses the admin-provided affiliate deep link.
 */
export function PromoPopupDialog({ settings }: { settings: PromoPopupSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const hidden =
    pathname.startsWith("/admin") || pathname.startsWith("/login");

  useEffect(() => {
    if (hidden || !open) return;

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
  }, [hidden, open]);

  if (hidden || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-[2px]"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-popup-title"
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
          href={settings.href}
          target="_blank"
          rel="sponsored noopener"
          onClick={() =>
            trackEvent("affiliate_click", {
              merchant: "shopee",
              placement: "promo_popup",
            })
          }
          className="block overflow-hidden rounded-2xl border border-white/30 bg-[#f04b23] shadow-[0_28px_80px_-20px_rgba(15,23,42,0.6)] transition hover:brightness-[1.02] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          aria-label={settings.title}
        >
          <Image
            src={settings.imageUrl}
            width={1200}
            height={675}
            alt={settings.alt}
            sizes="(max-width: 768px) 92vw, 768px"
            priority
            unoptimized
            className="h-auto w-full"
          />
        </a>

        <p id="promo-popup-title" className="sr-only">
          {settings.title}
        </p>
      </div>
    </div>
  );
}
