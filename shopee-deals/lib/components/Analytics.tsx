"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, hasAnalyticsConsent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Loads GA4 only after explicit consent and only when a Measurement ID is
 * configured. Initial page_view comes from gtag('config'); client-side route
 * changes are sent manually because the App Router does not reload the page.
 */
export function Analytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [enabled, pathname]);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
