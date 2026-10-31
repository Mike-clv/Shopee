import { z } from "zod";
import { CMS_PAGE_TYPES } from "@/lib/db/schema";
import { CMS_POST_ICONS } from "./types";

const httpOrPath = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Cần URL http(s) hoặc đường dẫn nội bộ bắt đầu bằng /",
  );

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Cần slug")
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang");

export const blockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("p"), text: z.string().trim().min(1) }),
  z.object({ kind: z.literal("h2"), text: z.string().trim().min(1) }),
  z.object({ kind: z.literal("tip"), text: z.string().trim().min(1) }),
  z.object({ kind: z.literal("list"), items: z.array(z.string().trim().min(1)).min(1) }),
  z.object({
    kind: z.literal("table"),
    caption: z.string().trim().optional(),
    headers: z.array(z.string().trim().min(1)).min(1),
    rows: z.array(z.array(z.string().trim())).min(1),
  }),
]);

export const faqSchema = z.object({
  question: z.string().trim().min(1, "Cần câu hỏi"),
  answer: z.string().trim().min(1, "Cần câu trả lời"),
});

export const sectionSchema = z.object({
  title: z.string().trim().min(1, "Cần tiêu đề mục"),
  paragraphs: z.array(z.string().trim().min(1)).min(1),
  bullets: z.array(z.string().trim().min(1)).optional(),
});

export const postMetaSchema = z.object({
  tagLabel: z.string().trim().min(1),
  tagHref: httpOrPath,
  minutes: z.coerce.number().int().min(1).max(180),
  gradient: z.string().trim().min(1),
  icon: z.enum(CMS_POST_ICONS),
  cover: z.object({
    src: httpOrPath,
    alt: z.string().trim().min(1),
    width: z.coerce.number().int().min(1).max(10000),
    height: z.coerce.number().int().min(1).max(10000),
    caption: z.string().trim().default(""),
  }),
  author: z.object({
    name: z.string().trim().min(1),
    title: z.string().trim().min(1),
    href: httpOrPath,
  }),
  hintedCtas: z
    .array(z.object({ label: z.string().trim().min(1), href: httpOrPath }))
    .max(6)
    .default([]),
  faqs: z.array(faqSchema).max(12).default([]),
});

export const checklistGroupSchema = z.object({
  title: z.string().trim().min(1),
  intro: z.string().trim().default(""),
  items: z.array(z.string().trim().min(1)).min(1),
});

export const guideSectionSchema = z.object({
  title: z.string().trim().min(1),
  paragraphs: z.array(z.string().trim().min(1)).min(1),
});

export const pageMetaSchema = z.object({
  pageType: z.enum(CMS_PAGE_TYPES),
  badge: z.string().trim().optional(),
  updated: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  intro: z.array(z.string().trim().min(1)).default([]),
  highlights: z.array(z.string().trim().min(1)).default([]),
  faqs: z.array(faqSchema).default([]),
  startISO: z.string().trim().optional(),
  endISO: z.string().trim().optional(),
  checklist: z.array(checklistGroupSchema).optional(),
  guide: z.array(guideSectionSchema).optional(),
});

export const postInputSchema = z.object({
  slug: slugSchema,
  path: z.string().trim().regex(/^\/blog\/[a-z0-9-]+$/, "Đường dẫn bài viết phải là /blog/<slug>"),
  title: z.string().trim().min(1).max(240),
  excerpt: z.string().trim().min(1).max(600),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(240).optional(),
  seoDescription: z.string().trim().max(600).optional(),
  isFeatured: z.boolean().default(false),
  body: z.array(blockSchema).min(1, "Bài viết cần ít nhất một block nội dung"),
  meta: postMetaSchema,
});

export const pageInputSchema = z.object({
  slug: slugSchema,
  path: z.string().trim().regex(/^\//, "Đường dẫn phải bắt đầu bằng /"),
  title: z.string().trim().min(1).max(240),
  excerpt: z.string().trim().max(600).optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(240).optional(),
  seoDescription: z.string().trim().max(600).optional(),
  body: z.array(sectionSchema).default([]),
  meta: pageMetaSchema,
});

export type PostInput = z.infer<typeof postInputSchema>;
export type PageInput = z.infer<typeof pageInputSchema>;
