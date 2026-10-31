import type { BlogPost } from "@/lib/blog/post-types";
import { EDITORIAL_TEAM } from "@/lib/blog/author";
import type { CmsEntry } from "@/lib/db/schema";
import { cmsIcon } from "./icons";
import type { CmsPageMeta, CmsPageOverride } from "./types";
import {
  blockSchema,
  pageMetaSchema,
  postMetaSchema,
  sectionSchema,
} from "./validation";
import { z } from "zod";

const bodySchema = z.array(blockSchema);
const pageBodySchema = z.array(sectionSchema);

export function cmsRowToPost(row: CmsEntry): BlogPost | null {
  const parsedMeta = postMetaSchema.safeParse(row.meta);
  if (!parsedMeta.success) return null;

  const parsedBody = bodySchema.safeParse(row.body);
  if (!parsedBody.success) return null;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    date: (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10),
    updated: row.updatedAt.toISOString().slice(0, 10),
    minutes: parsedMeta.data.minutes,
    tag: { label: parsedMeta.data.tagLabel, href: parsedMeta.data.tagHref },
    icon: cmsIcon(parsedMeta.data.icon),
    gradient: parsedMeta.data.gradient,
    cover: parsedMeta.data.cover,
    author: parsedMeta.data.author ?? EDITORIAL_TEAM,
    hintedCtas: parsedMeta.data.hintedCtas,
    faqs: parsedMeta.data.faqs,
    body: parsedBody.data,
  };
}

export function cmsRowToPageOverride(row: CmsEntry): CmsPageOverride | null {
  const parsedMeta = pageMetaSchema.safeParse(row.meta);
  if (!parsedMeta.success) return null;
  const parsedBody = pageBodySchema.safeParse(row.body);
  if (!parsedBody.success) return null;

  return {
    entryId: row.id,
    title: row.title,
    description: row.excerpt ?? "",
    body: parsedBody.data,
    meta: parsedMeta.data as CmsPageMeta,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    updatedAt: row.updatedAt,
  };
}
