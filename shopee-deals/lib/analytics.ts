/**
 * Privacy-first analytics helpers.
 *
 * Nothing is sent until the visitor explicitly accepts measurement cookies.
 * The consent choice lives in localStorage (no cookie needed for the banner
 * itself) and is broadcast through a custom event so analytics can start
 * without a page reload.
 */

export const CONSENT_STORAGE_KEY = "sansale-consent";
export const CONSENT_EVENT = "sansale:consent";

export type ConsentValue = "accepted" | "declined";

export type AnalyticsEventName =
  | "affiliate_click"
  | "search_submit"
  | "filter_apply"
  | "deal_view"
  | "cta_click"
  | "page_view";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage can be disabled (private mode, blocked cookies) — the banner
    // still closes for this page view and no analytics is loaded.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function hasAnalyticsConsent() {
  return readConsent() === "accepted";
}

/**
 * Sends a GA4 event only when measurement consent is present and gtag has
 * loaded. Safe to call from any client component; no-ops on the server.
 */
export function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}
