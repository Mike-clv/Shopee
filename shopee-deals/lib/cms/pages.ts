import "server-only";
import {
  getCategoryLanding,
  getMerchantLanding,
  type CategoryLanding,
  type MerchantLanding,
} from "@/lib/landing/content";
import { getSaleEventLanding, type SaleEventLanding } from "@/lib/events/content";
import { getLegalPage, type LegalPageContent } from "@/lib/legal/content";
import { getPublishedPageRow } from "./data";
import { cmsRowToPageOverride } from "./mappers";
import type { CmsPageOverride } from "./types";

/** Published override for a path, or null when code content should win. */
export async function getPageOverride(
  path: string,
): Promise<CmsPageOverride | null> {
  const row = await getPublishedPageRow(path);
  return row ? cmsRowToPageOverride(row) : null;
}

function pick<T>(override: T | undefined, fallback: T): T {
  return override === undefined ? fallback : override;
}

export async function resolveMerchantLanding(
  slug: string,
): Promise<MerchantLanding | undefined> {
  const base = getMerchantLanding(slug);
  if (!base) return undefined;
  const override = await getPageOverride(`/san/${slug}`);
  if (!override) return base;
  return {
    ...base,
    title: override.seoTitle ?? override.title,
    description: override.seoDescription ?? override.description,
    intro: pick(override.meta.intro.length ? override.meta.intro : undefined, base.intro),
    highlights: pick(
      override.meta.highlights.length ? override.meta.highlights : undefined,
      base.highlights,
    ),
    sections: pick(override.body.length ? override.body : undefined, base.sections),
    faqs: pick(override.meta.faqs.length ? override.meta.faqs : undefined, base.faqs),
  };
}

export async function resolveCategoryLanding(
  slug: string,
): Promise<CategoryLanding | undefined> {
  const base = getCategoryLanding(slug);
  if (!base) return undefined;
  const override = await getPageOverride(`/danh-muc/${slug}`);
  if (!override) return base;
  return {
    ...base,
    title: override.seoTitle ?? override.title,
    description: override.seoDescription ?? override.description,
    intro: pick(override.meta.intro.length ? override.meta.intro : undefined, base.intro),
    highlights: pick(
      override.meta.highlights.length ? override.meta.highlights : undefined,
      base.highlights,
    ),
    sections: pick(override.body.length ? override.body : undefined, base.sections),
    faqs: pick(override.meta.faqs.length ? override.meta.faqs : undefined, base.faqs),
  };
}

export async function resolveSaleEventLanding(
  slug: string,
): Promise<SaleEventLanding | undefined> {
  const base = getSaleEventLanding(slug);
  if (!base) return undefined;
  const override = await getPageOverride(`/su-kien/${slug}`);
  if (!override) return base;
  return {
    ...base,
    badge: override.meta.badge || base.badge,
    title: override.seoTitle ?? override.title,
    description: override.seoDescription ?? override.description,
    startISO: override.meta.startISO || base.startISO,
    endISO: override.meta.endISO || base.endISO,
    intro: pick(override.meta.intro.length ? override.meta.intro : undefined, base.intro),
    highlights: pick(
      override.meta.highlights.length ? override.meta.highlights : undefined,
      base.highlights,
    ),
    checklist: pick(
      override.meta.checklist?.length ? override.meta.checklist : undefined,
      base.checklist,
    ),
    guide: pick(override.meta.guide?.length ? override.meta.guide : undefined, base.guide),
    faqs: pick(override.meta.faqs.length ? override.meta.faqs : undefined, base.faqs),
  };
}

export async function resolveLegalPage(
  slug: string,
): Promise<LegalPageContent | undefined> {
  const base = getLegalPage(slug);
  if (!base) return undefined;
  const override = await getPageOverride(`/chinh-sach/${slug}`);
  if (!override) return base;
  return {
    ...base,
    title: override.seoTitle ?? override.title,
    description: override.seoDescription ?? override.description,
    updated:
      override.meta.updated ||
      override.updatedAt.toISOString().slice(0, 10) ||
      base.updated,
    sections: override.body.map((section) => ({
      heading: section.title,
      paragraphs: section.paragraphs,
      bullets: section.bullets,
    })),
  };
}
