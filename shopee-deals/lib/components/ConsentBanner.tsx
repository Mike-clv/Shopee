"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import {
  CONSENT_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/analytics";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): ConsentValue | null {
  return readConsent();
}

function getServerSnapshot(): ConsentValue | null | "unknown" {
  return "unknown";
}

/**
 * Minimal consent bar for GA4. Hidden on admin pages and only rendered after
 * hydration so the server HTML never disagrees with localStorage.
 */
export function ConsentBanner() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  if (consent !== null || dismissed || pathname.startsWith("/admin")) return null;

  return (
    <div
      role="dialog"
      aria-label="Tuỳ chọn đo lường"
      aria-describedby="consent-description"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-2xl border border-line bg-white p-4 shadow-[0_18px_50px_-18px_rgba(15,23,42,0.35)] sm:bottom-5"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Cookie className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-relaxed text-ink/70" id="consent-description">
            Website dùng cookie đo lường để hiểu nội dung nào hữu ích. Bạn có thể đồng ý
            hoặc chỉ dùng cookie cần thiết.{" "}
            <Link
              href="/chinh-sach/cookie"
              className="font-semibold text-brand underline-offset-2 hover:underline"
            >
              Chính sách cookie
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                writeConsent("accepted");
                setDismissed(true);
              }}
              className="inline-flex h-9 items-center justify-center rounded-full bg-brand px-4 text-xs font-semibold text-white transition hover:bg-brand-dark"
            >
              Đồng ý đo lường
            </button>
            <button
              type="button"
              onClick={() => {
                writeConsent("declined");
                setDismissed(true);
              }}
              className="inline-flex h-9 items-center justify-center rounded-full border border-line bg-white px-4 text-xs font-semibold text-ink/60 transition hover:border-brand/30 hover:text-brand"
            >
              Chỉ cookie cần thiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
