import { SITE } from "@/lib/site";

type Merchant = (typeof SITE.merchants)[number];

export type BrandLinkCheck = {
  merchant: Merchant;
  ok: boolean;
  status: number;
  finalUrl: string;
  error?: string;
};

const MAX_HOPS = 12;
const HOP_TIMEOUT_MS = 10_000;

/** Brand domains the redirect chain may land on (suffix match, incl. www). */
const ALLOWED_HOST_SUFFIXES: Record<Merchant, string[]> = {
  shopee: ["shopee.vn"],
  tiki: ["tiki.vn", "ti.ki"], // ti.ki = Tiki's own short domain (AT lands there)
  lazada: ["lazada.vn"],
  tiktokshop: ["tiktok.com"],
};

/** AccessTrade infrastructure hosts — they may serve HTML (meta/JS) redirects. */
const AT_HOST_PATTERN = /(^|\.)accesstrade\.vn$|(^|\.)isclix\.com$|(^|\.)shorten\.asia$/;

function hostMatches(url: string, suffixes: string[]): boolean {
  let host = "";
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return suffixes.some((s) => host === s || host.endsWith(`.${s}`));
}

function isRedirect(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

/**
 * Walk each merchant homepage link's redirect chain the way a browser would.
 * A healthy link ends on the brand's own domain — dead/expired AccessTrade
 * links stop early (isclix answers 404/500) or never reach the brand host.
 * Two real-world twists (verified against live links): AT can land Tiki on
 * its short domain ti.ki, and the AT click server may answer 200 with an
 * HTML meta/JS redirect instead of an HTTP 3xx — in that case the page body
 * is inspected for the brand domain before declaring the link dead.
 */
export async function checkBrandLinks(): Promise<BrandLinkCheck[]> {
  const entries = Object.entries(SITE.merchantHomeLinks) as [Merchant, string][];
  return Promise.all(
    entries.map(async ([merchant, link]): Promise<BrandLinkCheck> => {
      try {
        const suffixes = ALLOWED_HOST_SUFFIXES[merchant];
        let url = link;
        let status = 0;
        for (let hops = 0; hops < MAX_HOPS; hops++) {
          const res = await fetch(url, {
            redirect: "manual",
            signal: AbortSignal.timeout(HOP_TIMEOUT_MS),
            headers: { "user-agent": "Mozilla/5.0 (compatible; sansale247-link-check/1.0)" },
            cache: "no-store",
          });
          status = res.status;
          const location = res.headers.get("location");
          if (location && isRedirect(res.status)) {
            url = new URL(location, url).toString();
            continue;
          }
          break;
        }
        let ok = hostMatches(url, suffixes);
        // AT hop answered 200 with an in-page redirect — sniff the body.
        if (!ok) {
          try {
            if (AT_HOST_PATTERN.test(new URL(url).hostname.toLowerCase())) {
              const res = await fetch(url, {
                signal: AbortSignal.timeout(HOP_TIMEOUT_MS),
                headers: { "user-agent": "Mozilla/5.0 (compatible; sansale247-link-check/1.0)" },
                cache: "no-store",
              });
              if (res.ok) {
                const body = (await res.text()).toLowerCase();
                ok = suffixes.some((s) => body.includes(s));
                status = res.status;
              }
            }
          } catch {
            // keep the failed verdict from the walk
          }
        }
        return { merchant, ok, status, finalUrl: url };
      } catch (error) {
        return {
          merchant,
          ok: false,
          status: 0,
          finalUrl: "",
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }),
  );
}
