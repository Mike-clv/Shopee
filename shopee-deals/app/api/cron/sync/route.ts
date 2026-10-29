import type { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { syncAll } from "@/lib/coupons/sync";

/**
 * Scheduler entry point. Vercel Cron hits it daily (00:00 GMT+7) via vercel.json.
 * Locally (no CRON_SECRET set) it can be called freely for testing:
 *   curl http://localhost:3000/api/cron/sync
 *
 * Protection: when CRON_SECRET is configured, the request must carry
 * `Authorization: Bearer <CRON_SECRET>` (Vercel Cron does this automatically).
 *
 * Runs the three pipelines sequentially: Shopee coupon offers, Tiki/Lazada
 * product datafeeds, TikTok Shop products. Each writes its own sync_logs row
 * (message prefixed), so partial failures stay visible per marketplace.
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET?.trim();
  // Fail-closed in production: every sync run burns Accesstrade API quota and
  // mints affiliate links, so an unconfigured secret must never leave the
  // endpoint publicly triggerable. Local dev stays open for manual testing.
  if (!expected && process.env.NODE_ENV === "production") {
    return Response.json(
      {
        ok: false,
        error: "CRON_SECRET is required in production. Set it to enable the sync endpoint.",
      },
      { status: 403 },
    );
  }
  if (expected) {
    const actual = request.headers.get("authorization")?.trim();
    const provided = actual?.startsWith("Bearer ") ? actual.slice(7) : null;
    // Constant-time secret compare: digest both sides to fixed length so the
    // timing oracle cannot reveal how much of the secret matched.
    const sha = (v: string) => createHash("sha256").update(v, "utf8").digest();
    const ok =
      provided != null && timingSafeEqual(sha(provided), sha(expected));
    if (!ok) {
      return Response.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
  }

  const report = await syncAll("cron");
  return Response.json(
    { ok: report.okCount > 0, ...report },
    { status: report.okCount > 0 ? 200 : 502 },
  );
}
