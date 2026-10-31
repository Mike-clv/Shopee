import "server-only";
import { CATEGORY_SLUGS, categoryFromSlug } from "@/lib/categories";
import { getCategoryLanding, getMerchantLanding } from "@/lib/landing/content";
import { SALE_EVENT_LANDINGS } from "@/lib/events/content";
import { LEGAL_PAGES } from "@/lib/legal/content";
import { SITE } from "@/lib/site";
import type { LandingSection } from "@/lib/landing/merchant-sections";
import type { CmsFaq } from "./types";
import type { CmsPageMeta } from "./types";

export type CmsPageType = CmsPageMeta["pageType"];

export type StaticPageDefinition = {
  path: string;
  slug: string;
  pageType: CmsPageType;
  title: string;
  description: string;
  badge?: string;
  updated?: string;
  source: "merchant" | "category" | "event" | "legal";
};

export type StaticPageSeed = StaticPageDefinition & {
  intro: string[];
  highlights: string[];
  sections: LandingSection[];
  faqs: CmsFaq[];
  meta: CmsPageMeta;
};

const MERCHANT_PATHS = Object.keys(SITE.merchantLabels).map((slug) => ({
  path: `/san/${slug}`,
  slug,
  pageType: "merchant" as const,
  title: getMerchantLanding(slug)?.title ?? `Deal ${SITE.merchantLabels[slug as keyof typeof SITE.merchantLabels]}`,
  description: getMerchantLanding(slug)?.description ?? "",
  source: "merchant" as const,
}));

const CATEGORY_PATHS = CATEGORY_SLUGS.map((slug) => {
  const landing = getCategoryLanding(slug);
  return {
    path: `/danh-muc/${slug}`,
    slug,
    pageType: "category" as const,
    title: landing?.title ?? `Deal ${categoryFromSlug(slug).label}`,
    description: landing?.description ?? "",
    source: "category" as const,
  };
});

const EVENT_PATHS = SALE_EVENT_LANDINGS.map((event) => ({
  path: `/su-kien/${event.slug}`,
  slug: event.slug,
  pageType: "event" as const,
  title: event.title,
  description: event.description,
  badge: event.badge,
  source: "event" as const,
}));

const LEGAL_PATHS = LEGAL_PAGES.map((page) => ({
  path: `/chinh-sach/${page.slug}`,
  slug: page.slug,
  pageType: "legal" as const,
  title: page.title,
  description: page.description,
  updated: page.updated,
  source: "legal" as const,
}));

export function listStaticPageDefinitions(): StaticPageDefinition[] {
  return [...MERCHANT_PATHS, ...CATEGORY_PATHS, ...EVENT_PATHS, ...LEGAL_PATHS];
}

/** Prefill the CMS editor with the current code content for a known path. */
export function getStaticPageSeed(path: string): StaticPageSeed | null {
  const definition = listStaticPageDefinitions().find((item) => item.path === path);
  if (!definition) return null;

  if (definition.source === "merchant") {
    const landing = getMerchantLanding(definition.slug);
    if (!landing) return null;
    return {
      ...definition,
      intro: landing.intro,
      highlights: landing.highlights,
      sections: landing.sections,
      faqs: landing.faqs,
      meta: {
        pageType: "merchant",
        intro: landing.intro,
        highlights: landing.highlights,
        faqs: landing.faqs,
        badge: `Deal theo sàn · ${SITE.merchantLabels[definition.slug as keyof typeof SITE.merchantLabels]}`,
      },
    };
  }

  if (definition.source === "category") {
    const landing = getCategoryLanding(definition.slug);
    if (!landing) return null;
    return {
      ...definition,
      intro: landing.intro,
      highlights: landing.highlights,
      sections: landing.sections,
      faqs: landing.faqs,
      meta: {
        pageType: "category",
        intro: landing.intro,
        highlights: landing.highlights,
        faqs: landing.faqs,
        badge: `Deal theo danh mục · ${categoryFromSlug(definition.slug).label}`,
      },
    };
  }

  if (definition.source === "event") {
    const event = SALE_EVENT_LANDINGS.find((item) => item.slug === definition.slug);
    if (!event) return null;
    return {
      ...definition,
      intro: event.intro,
      highlights: event.highlights,
      sections: [],
      faqs: event.faqs,
      meta: {
        pageType: "event",
        badge: event.badge,
        startISO: event.startISO,
        endISO: event.endISO,
        intro: event.intro,
        highlights: event.highlights,
        faqs: event.faqs,
        checklist: event.checklist,
        guide: event.guide,
      },
    };
  }

  const legal = LEGAL_PAGES.find((item) => item.slug === definition.slug);
  if (!legal) return null;
  return {
    ...definition,
    intro: [],
    highlights: [],
    sections: legal.sections.map((section) => ({
      title: section.heading,
      paragraphs: section.paragraphs ?? [],
      bullets: section.bullets,
    })),
    faqs: [],
    meta: {
      pageType: "legal",
      updated: legal.updated,
      intro: [],
      highlights: [],
      faqs: [],
    },
  };
}
