import { NextResponse, type NextRequest } from "next/server";
import { getPost } from "@/lib/blog/posts";
import { publishedCmsPostExists } from "@/lib/cms/exists";
import { activeDealExists } from "@/lib/coupons/dealExists";
import { getCategoryLanding, getMerchantLanding } from "@/lib/landing/content";
import { getLegalPage } from "@/lib/legal/content";

/**
 * Global security headers + legacy SEO routing.
 *
 * CSP intentionally ships Report-Only first: Next's hydration scripts need a
 * nonce under a real CSP, and flipping to include `unsafe-inline` weakened
 * enforcement silently. Report data surfaces violations in the browser console
 * only (no report-uri endpoint) — once renovations settle, upgrade to a real
 * CSP with a nonce generated here.
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: http:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

/**
 * Old pages that Google still has in its index but that no longer have a
 * relevant replacement. 410 tells crawlers to drop them instead of retrying a
 * 404 forever. New About/policy pages will use new URLs in P1.
 */
const LEGACY_GONE = new Set([
  "/gioi-thieu",
  "/chinh-sach",
  "/quan-tam",
  "/thuong-hieu",
  "/theo-doi-gia",
  "/tinh-tra-gop",
]);

/**
 * Old sections that Google indexed as individual pages. Their parent paths
 * already return 410; nested URLs must do the same instead of falling through
 * to a plain 404, so crawlers drop them immediately.
 */
const LEGACY_GONE_PREFIXES = ["/quan-tam/", "/thuong-hieu/"];

const MERCHANT_ALIASES: Record<string, string> = {
  "tiktok-shop": "tiktokshop",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const KNOWN_MERCHANTS = new Set(["shopee", "tiki", "lazada", "tiktokshop"]);

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Map old, still-indexed URLs to the closest page that exists today.
 * These are permanent (301) because the old URL will never come back.
 */
function legacyRedirectTarget(pathname: string): string | null {
  if (
    pathname === "/danh-muc" ||
    pathname === "/ma-giam-gia" ||
    pathname === "/san"
  ) {
    return "/tim-kiem";
  }

  // The old legal page predates the /chinh-sach/ structure and still has
  // indexed links. Point it at the current terms page instead of a 404.
  if (pathname === "/dieu-khoan") {
    return "/chinh-sach/dieu-khoan-su-dung";
  }

  // Merchant/category landing pages are real routes now. Only the historical
  // TikTok alias needs a permanent redirect; unknown slugs fall through to the
  // route, which returns a real 404.
  const merchantMatch = pathname.match(/^\/san\/([^/]+)$/);
  if (merchantMatch) {
    const requested = safeDecode(merchantMatch[1]);
    const merchant = MERCHANT_ALIASES[requested] ?? requested;
    if (merchant !== requested && KNOWN_MERCHANTS.has(merchant)) {
      return `/san/${merchant}`;
    }
    return null;
  }

  const legacyDealMatch = pathname.match(/^\/ma-giam-gia\/([^/]+)$/);
  if (legacyDealMatch) {
    return `/tim-kiem?q=${encodeURIComponent(safeDecode(legacyDealMatch[1]))}`;
  }

  return null;
}

function notFoundResponse(
  cacheControl = "public, max-age=60",
): NextResponse {
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>Không tìm thấy trang — Mã Giảm Giá Đa Sàn</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f7f5f2; color: #1f2937; font: 16px/1.6 system-ui, sans-serif; }
    main { max-width: 34rem; padding: 2rem; text-align: center; }
    h1 { margin: 0 0 .75rem; font-size: 1.75rem; }
    p { margin: 0 0 1.5rem; color: #4b5563; }
    a { display: inline-block; margin: .25rem; padding: .7rem 1rem; border-radius: .5rem; background: #e85d04; color: #fff; text-decoration: none; font-weight: 600; }
    a.secondary { background: #fff; color: #e85d04; border: 1px solid #e85d04; }
  </style>
</head>
<body>
  <main>
    <h1>Không tìm thấy trang</h1>
    <p>Trang này không tồn tại hoặc đã được gỡ. Anh/chị có thể xem deal mới hoặc tìm mã khác đang chạy.</p>
    <a href="/">Về trang chủ</a>
    <a class="secondary" href="/tim-kiem">Tìm mã giảm giá</a>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": cacheControl,
    },
  });
}

function goneResponse(): NextResponse {
  const html = `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, follow">
  <title>Trang đã được gỡ — Mã Giảm Giá Đa Sàn</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f7f5f2; color: #1f2937; font: 16px/1.6 system-ui, sans-serif; }
    main { max-width: 34rem; padding: 2rem; text-align: center; }
    h1 { margin: 0 0 .75rem; font-size: 1.75rem; }
    p { margin: 0 0 1.5rem; color: #4b5563; }
    a { display: inline-block; margin: .25rem; padding: .7rem 1rem; border-radius: .5rem; background: #e85d04; color: #fff; text-decoration: none; font-weight: 600; }
    a.secondary { background: #fff; color: #e85d04; border: 1px solid #e85d04; }
  </style>
</head>
<body>
  <main>
    <h1>Trang này đã được gỡ</h1>
    <p>Nội dung cũ không còn phù hợp với website hiện tại. Anh/chị có thể xem deal mới hoặc tìm mã giảm giá đang chạy.</p>
    <a href="/">Về trang chủ</a>
    <a class="secondary" href="/tim-kiem">Tìm mã giảm giá</a>
  </main>
</body>
</html>`;

  return new NextResponse(html, {
    status: 410,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function withSecurityHeaders(
  response: NextResponse,
  request: NextRequest,
): NextResponse {
  const headers = response.headers;
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Content-Security-Policy-Report-Only", CSP_REPORT_ONLY);

  // HSTS in production only: browsers cache the policy globally, and pinning
  // it for localhost would break future local https/http experiments.
  const host = (request.headers.get("host") ?? "")
    .split(":")[0]
    .toLowerCase()
    .replace(/^\[|\]$/g, "");
  const isLocal =
    host === "localhost" || host === "127.0.0.1" || host === "::1";
  if (!isLocal) {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const normalized =
    pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;

  if (
    LEGACY_GONE.has(normalized) ||
    LEGACY_GONE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  ) {
    return withSecurityHeaders(goneResponse(), request);
  }

  // Reject malformed or missing deal ids before the page renders. The page
  // still loads the full row; this early check is what makes a missing valid
  // UUID a real 404 instead of a streamed 200 + noindex error shell.
  const dealMatch = normalized.match(/^\/ma\/([^/]+)$/);
  if (dealMatch) {
    const id = safeDecode(dealMatch[1]);
    if (!UUID_RE.test(id) || !(await activeDealExists(id))) {
      return withSecurityHeaders(notFoundResponse(), request);
    }
  }

  // Same reason as deals: reject an unknown blog slug before the PPR shell
  // can flush a 200. Static posts short-circuit; CMS-only slugs need a cheap
  // published-row lookup. A no-store 404 prevents a stale cached 404 from
  // hiding a slug that is published later.
  const blogMatch = normalized.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const slug = safeDecode(blogMatch[1]);
    if (!getPost(slug) && !(await publishedCmsPostExists(slug))) {
      return withSecurityHeaders(notFoundResponse("no-store"), request);
    }
  }

  // Policy pages are a fixed set. Reject unknown slugs before the PPR shell
  // so they return a real 404 instead of a streamed 200.
  const legalMatch = normalized.match(/^\/chinh-sach\/([^/]+)$/);
  if (legalMatch && !getLegalPage(safeDecode(legalMatch[1]))) {
    return withSecurityHeaders(notFoundResponse(), request);
  }

  const redirectTarget = legacyRedirectTarget(normalized);
  if (redirectTarget) {
    return withSecurityHeaders(
      NextResponse.redirect(new URL(redirectTarget, request.url), 301),
      request,
    );
  }

  // Merchant/category landing pages are static sets. Unknown slugs must 404
  // before the PPR shell flushes a 200; run this after the TikTok alias
  // redirect so /san/tiktok-shop still lands on /san/tiktokshop.
  const merchantMatch = normalized.match(/^\/san\/([^/]+)$/);
  if (merchantMatch && !getMerchantLanding(safeDecode(merchantMatch[1]))) {
    return withSecurityHeaders(notFoundResponse(), request);
  }

  const categoryMatch = normalized.match(/^\/danh-muc\/([^/]+)$/);
  if (categoryMatch && !getCategoryLanding(safeDecode(categoryMatch[1]))) {
    return withSecurityHeaders(notFoundResponse(), request);
  }

  return withSecurityHeaders(NextResponse.next(), request);
}

export const config = {
  // Run on every page/route except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
