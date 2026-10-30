import { and, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { couponDeals } from "@/lib/db/schema";

/**
 * Existence check used by the proxy before the deal page starts streaming.
 *
 * The page still loads the full row; this query exists only so a valid-shaped
 * UUID that is missing/expired can return a real 404 instead of a streamed
 * 200 + noindex error shell.
 */
export async function activeDealExists(id: string): Promise<boolean> {
  const db = await getDatabase();
  const rows = await db
    .select({ id: couponDeals.id })
    .from(couponDeals)
    .where(and(eq(couponDeals.id, id), sql`${couponDeals.isActive} = true`))
    .limit(1);
  return rows.length > 0;
}
