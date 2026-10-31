import type { BlogBlock, BlogFaq } from "@/lib/blog/post-types";
import type { LandingSection } from "@/lib/landing/merchant-sections";

export type CmsFaq = { question: string; answer: string };

/** Icon keys the blog renderer knows how to resolve. Keep in sync with lib/cms/icons.ts. */
export const CMS_POST_ICONS = [
  "BadgePercent",
  "Truck",
  "BookOpen",
  "Timer",
  "Zap",
  "CalendarDays",
  "ListChecks",
  "ShoppingBag",
  "Sparkles",
  "Tag",
] as const;

export type CmsPostIcon = (typeof CMS_POST_ICONS)[number];

export type CmsPostMeta = {
  tagLabel: string;
  tagHref: string;
  minutes: number;
  gradient: string;
  icon: CmsPostIcon;
  cover: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
  author: {
    name: string;
    title: string;
    href: string;
  };
  hintedCtas: Array<{ label: string; href: string }>;
  faqs: BlogFaq[];
};

export type CmsChecklistGroup = {
  title: string;
  intro: string;
  items: string[];
};

export type CmsGuideSection = {
  title: string;
  paragraphs: string[];
};

export type CmsPageMeta = {
  pageType: (typeof import("@/lib/db/schema").CMS_PAGE_TYPES)[number];
  badge?: string;
  updated?: string;
  intro: string[];
  highlights: string[];
  faqs: CmsFaq[];
  startISO?: string;
  endISO?: string;
  checklist?: CmsChecklistGroup[];
  guide?: CmsGuideSection[];
};

/** Normalised override consumed by public landing/legal routes. */
export type CmsPageOverride = {
  entryId: string;
  title: string;
  description: string;
  body: LandingSection[];
  meta: CmsPageMeta;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: Date;
};

export type CmsPostBody = BlogBlock[];

export type CmsEntrySummary = {
  id: string;
  kind: "post" | "page";
  slug: string;
  path: string;
  title: string;
  status: "draft" | "published";
  updatedAt: Date;
};

export type CmsSettingValue = Record<string, unknown>;
