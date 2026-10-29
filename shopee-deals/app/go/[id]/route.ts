import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { couponDeals } from "@/lib/db/schema";
import { getActiveDealByIdUncached } from "@/lib/coupons/data";
import { isSafeRedirectTarget } from "@/lib/url-guard";

/**
 * Affiliate redirect. Runs per request (reads DB + headers), never cached:
 * coupon must be able to stop redirecting the instant it is disabled.
 * Click counting goes through after() so the visitor is not delayed.
 */
export async function GET(
  _request: NextRequest,
  ctx: RouteContext<"/go/[id]">,
) {
  // Route handlers become request-time here because DB access is uncached;
  // headers() additionally guarantees no scenario prerenders this handler.
  await headers();
  const { id } = await ctx.params;

  // Cheap sanity check before spending a DB query on a non-uuid id.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    redirect("/");
  }

  const deal = await getActiveDealByIdUncached(id);
  if (!deal || !deal.affLink || !isSafeRedirectTarget(deal.affLink)) {
    redirect("/");
  }

  after(async () => {
    try {
      const db = await getDatabase();
      await db
        .update(couponDeals)
        .set({ clickCount: sql`${couponDeals.clickCount} + 1` })
        .where(eq(couponDeals.id, deal.id));
    } catch (error) {
      console.error("[go] failed to record click", { id: deal.id, error });
    }
  });

  // 307 keeps the GET method through redirects (AT → merchant chain).
  return Response.redirect(deal.affLink, 307);
}
