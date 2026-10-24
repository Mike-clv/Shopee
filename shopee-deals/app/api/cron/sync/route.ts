import type { NextRequest } from "next/server";
import { syncAccesstrade } from "@/lib/coupons/sync";

/**
 * Scheduler entry point. Vercel Cron hits it every 30 minutes via vercel.json.
 * Locally (no CRON_SECRET set) it can be called freely for testing:
 *   curl http://localhost:3000/api/cron/sync
 *
 * Protection: when CRON_SECRET is configured, the request must carry
 * `Authorization: Bearer <CRON_SECRET>` (Vercel Cron does this automatically).
 */
export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET?.trim();
  if (expected) {
    const actual = request.headers.get("authorization")?.trim();
    const provided = actual?.startsWith("Bearer ") ? actual.slice(7) : null;
    if (provided !== expected) {
      return Response.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }
  }

  const result = await syncAccesstrade("cron");
  return Response.json(
    { ok: result.status === "success", ...result },
    { status: result.status === "success" ? 200 : 502 },
  );
}
