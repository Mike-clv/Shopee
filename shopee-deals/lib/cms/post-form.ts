import "server-only";
import type { BlogPost } from "@/lib/blog/post-types";
import type { CmsEntry } from "@/lib/db/schema";
import { postMetaSchema } from "./validation";
import type { PostInput } from "./validation";
import type { CmsPostIcon } from "./types";

const STATIC_ICONS: Record<string, CmsPostIcon> = {
  "ma-giam-gia-shopee-hom-nay": "BadgePercent",
  "voucher-freeship-shopee-khong-ap-duoc": "Truck",
  "mua-sach-tiki-gia-tot": "BookOpen",
  "lazada-flash-sale-khung-gio": "Timer",
  "tiktok-shop-livestream-gia-that": "Zap",
  "chuan-bi-sale-11-11": "CalendarDays",
  "stack-voucher-shopee-3-lop": "BadgePercent",
  "chon-sach-thi-toeic-ielts": "BookOpen",
  "tiktok-shop-nha-ban-uu-tien": "Zap",
  "kiem-tra-ma-truoc-het-han": "ListChecks",
};

export function staticPostToInput(post: BlogPost): PostInput {
  return {
    slug: post.slug,
    path: `/blog/${post.slug}`,
    title: post.title,
    excerpt: post.excerpt,
    status: "published",
    seoTitle: post.title,
    seoDescription: post.excerpt,
    isFeatured: false,
    body: post.body,
    meta: {
      tagLabel: post.tag.label,
      tagHref: post.tag.href,
      minutes: post.minutes,
      gradient: post.gradient,
      icon: STATIC_ICONS[post.slug] ?? "Tag",
      cover: post.cover,
      author: post.author,
      hintedCtas: post.hintedCtas,
      faqs: post.faqs,
    },
  };
}

export function cmsPostToInput(row: CmsEntry): PostInput | null {
  const meta = postMetaSchema.safeParse(row.meta);
  if (!meta.success) return null;
  return {
    slug: row.slug,
    path: row.path,
    title: row.title,
    excerpt: row.excerpt ?? "",
    status: row.status,
    seoTitle: row.seoTitle ?? "",
    seoDescription: row.seoDescription ?? "",
    isFeatured: row.isFeatured,
    body: Array.isArray(row.body) ? (row.body as PostInput["body"]) : [],
    meta: meta.data,
  };
}
