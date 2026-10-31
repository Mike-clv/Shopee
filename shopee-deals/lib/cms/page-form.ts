import type { CmsEntry } from "@/lib/db/schema";
import type { StaticPageSeed } from "./registry";
import type { PageInput } from "./validation";
import { cmsRowToPageOverride } from "./mappers";
import { pageInputSchema } from "./validation";

export function staticSeedToInput(seed: StaticPageSeed): PageInput {
  return {
    slug: seed.slug,
    path: seed.path,
    title: seed.title,
    excerpt: seed.description,
    status: "published",
    body: seed.sections,
    meta: seed.meta,
  };
}

export function cmsPageToInput(row: CmsEntry): PageInput | null {
  const page = cmsRowToPageOverride(row);
  if (!page) return null;
  const parsed = pageInputSchema.safeParse({
    slug: row.slug,
    path: row.path,
    title: row.title,
    excerpt: row.excerpt ?? "",
    status: row.status,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
    body: page.body,
    meta: page.meta,
  });
  return parsed.success ? parsed.data : null;
}
