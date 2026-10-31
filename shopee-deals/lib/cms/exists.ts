import { and, eq } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { cmsEntries } from "@/lib/db/schema";

/**
 * Existence check used by the proxy before the blog detail route starts
 * streaming. Static posts short-circuit this check; CMS-only slugs need a
 * cheap lookup so a published post is not rejected as an unknown slug.
 */
export async function publishedCmsPostExists(slug: string): Promise<boolean> {
  const db = await getDatabase();
  const rows = await db
    .select({ id: cmsEntries.id })
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.kind, "post"),
        eq(cmsEntries.slug, slug),
        eq(cmsEntries.status, "published"),
      ),
    )
    .limit(1);
  return rows.length > 0;
}
