import { NextResponse, type NextRequest } from "next/server";

/**
 * Global security headers.
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

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
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

export const config = {
  // Run on every page/route except Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
