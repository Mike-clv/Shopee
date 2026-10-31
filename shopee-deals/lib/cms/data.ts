import "server-only";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDatabase } from "@/lib/db";
import {
  cmsEntries,
  contentAuditLogs,
  mediaAssets,
  siteSettings,
  type CmsEntry,
  type ContentAuditLog,
  type MediaAsset,
  type SiteSetting,
} from "@/lib/db/schema";
import type { BlogPost } from "@/lib/blog/post-types";
import { cmsRowToPost } from "./mappers";
import {
  DEFAULT_PROMO_POPUP,
  normalizePromoPopup,
  type PromoPopupSettings,
} from "./promo-popup";
import type { CmsEntrySummary } from "./types";

/** Public CMS reads are tagged so a publish/update can invalidate them. */
export const CMS_CACHE_TAG = "cms";

export type CmsListOptions = {
  kind?: "post" | "page";
  status?: "draft" | "published";
  q?: string;
  limit?: number;
  page?: number;
};

function cmsWhere(options: CmsListOptions) {
  return and(
    options.kind ? eq(cmsEntries.kind, options.kind) : undefined,
    options.status ? eq(cmsEntries.status, options.status) : undefined,
    options.q
      ? or(
          ilike(cmsEntries.title, `%${options.q}%`),
          ilike(cmsEntries.path, `%${options.q}%`),
          ilike(cmsEntries.slug, `%${options.q}%`),
        )
      : undefined,
  );
}

export async function listCmsEntries(
  options: CmsListOptions = {},
): Promise<CmsEntrySummary[]> {
  const db = await getDatabase();
  const limit = Math.min(options.limit ?? 30, 100);
  const offset = ((options.page ?? 1) - 1) * limit;
  const rows = await db
    .select({
      id: cmsEntries.id,
      kind: cmsEntries.kind,
      slug: cmsEntries.slug,
      path: cmsEntries.path,
      title: cmsEntries.title,
      status: cmsEntries.status,
      updatedAt: cmsEntries.updatedAt,
    })
    .from(cmsEntries)
    .where(cmsWhere(options))
    .orderBy(desc(cmsEntries.updatedAt))
    .limit(limit)
    .offset(offset);
  return rows;
}

export async function countCmsEntries(
  options: CmsListOptions = {},
): Promise<number> {
  const db = await getDatabase();
  const [row] = await db
    .select({ value: count() })
    .from(cmsEntries)
    .where(cmsWhere(options));
  return Number(row?.value ?? 0);
}

export async function getCmsEntryById(id: string): Promise<CmsEntry | null> {
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(cmsEntries)
    .where(eq(cmsEntries.id, id))
    .limit(1);
  return row ?? null;
}

export async function getCmsEntryByPath(path: string): Promise<CmsEntry | null> {
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(cmsEntries)
    .where(eq(cmsEntries.path, path))
    .limit(1);
  return row ?? null;
}

/**
 * Cache only plain rows. BlogPost carries a Lucide icon (a React component),
 * and functions cannot cross the "use cache" serialization boundary.
 */
export async function listPublishedCmsPostRows(): Promise<CmsEntry[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CMS_CACHE_TAG);
  const db = await getDatabase();
  return db
    .select()
    .from(cmsEntries)
    .where(and(eq(cmsEntries.kind, "post"), eq(cmsEntries.status, "published")))
    .orderBy(desc(cmsEntries.publishedAt), desc(cmsEntries.updatedAt));
}

export async function getPublishedCmsPostRow(
  slug: string,
): Promise<CmsEntry | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CMS_CACHE_TAG);
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.kind, "post"),
        eq(cmsEntries.slug, slug),
        eq(cmsEntries.status, "published"),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function listPublishedCmsPosts(): Promise<BlogPost[]> {
  const rows = await listPublishedCmsPostRows();
  return rows
    .map((row) => cmsRowToPost(row))
    .filter((post): post is BlogPost => post !== null);
}

export async function getPublishedCmsPost(
  slug: string,
): Promise<BlogPost | null> {
  const row = await getPublishedCmsPostRow(slug);
  return row ? cmsRowToPost(row) : null;
}

export async function listPublishedPageRows(): Promise<CmsEntry[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CMS_CACHE_TAG);
  const db = await getDatabase();
  return db
    .select()
    .from(cmsEntries)
    .where(and(eq(cmsEntries.kind, "page"), eq(cmsEntries.status, "published")));
}

export async function getPublishedPageRow(
  path: string,
): Promise<CmsEntry | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CMS_CACHE_TAG);
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(cmsEntries)
    .where(
      and(
        eq(cmsEntries.kind, "page"),
        eq(cmsEntries.path, path),
        eq(cmsEntries.status, "published"),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function listMediaAssets(limit = 60): Promise<MediaAsset[]> {
  const db = await getDatabase();
  return db
    .select()
    .from(mediaAssets)
    .orderBy(desc(mediaAssets.createdAt))
    .limit(Math.min(limit, 200));
}

export async function listSiteSettings(): Promise<SiteSetting[]> {
  const db = await getDatabase();
  return db.select().from(siteSettings).orderBy(siteSettings.key);
}

export async function getSiteSetting<T>(
  key: string,
  fallback: T,
): Promise<T> {
  const db = await getDatabase();
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);
  return (row?.value as T | undefined) ?? fallback;
}

/** Cached public read for the entrance popup; invalidated by CMS writes. */
export async function getPromoPopupSettings(): Promise<PromoPopupSettings> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CMS_CACHE_TAG);
  const stored = await getSiteSetting<unknown>("promoPopup", DEFAULT_PROMO_POPUP);
  return normalizePromoPopup(stored);
}

export async function listAuditLogs(limit = 40): Promise<ContentAuditLog[]> {
  const db = await getDatabase();
  return db
    .select()
    .from(contentAuditLogs)
    .orderBy(desc(contentAuditLogs.createdAt))
    .limit(Math.min(limit, 200));
}

export async function countCmsEntriesByStatus(): Promise<{
  posts: number;
  pages: number;
  drafts: number;
  published: number;
}> {
  const db = await getDatabase();
  const rows = await db
    .select({ kind: cmsEntries.kind, status: cmsEntries.status, value: count() })
    .from(cmsEntries)
    .groupBy(cmsEntries.kind, cmsEntries.status);
  let posts = 0;
  let pages = 0;
  let drafts = 0;
  let published = 0;
  for (const row of rows) {
    const value = Number(row.value);
    if (row.kind === "post") posts += value;
    else pages += value;
    if (row.status === "draft") drafts += value;
    else published += value;
  }
  return { posts, pages, drafts, published };
}
