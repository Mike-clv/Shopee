/**
 * Blog content, stored in code (no CMS, no DB). Posts are split into one file
 * per article so long-form copy stays readable. Dates are static ISO strings
 * so the listing and detail pages remain fully prerenderable.
 */

import { shopeeMaPost } from "./articles/shopee-ma";
import { freeshipPost } from "./articles/freeship";
import { sachTikiPost } from "./articles/sach-tiki";
import { lazadaPost } from "./articles/lazada";
import { tiktokLivestreamPost } from "./articles/tiktok-livestream";
import { sale1111Post } from "./articles/11-11";
import { stackVoucherPost } from "./articles/stack-voucher";
import { toeicIeltsPost } from "./articles/toeic-ielts";
import { tiktokSellerPost } from "./articles/tiktok-seller";
import { routinePost } from "./articles/routine";
import type { BlogPost } from "./post-types";

export type {
  BlogAuthor,
  BlogBlock,
  BlogCover,
  BlogFaq,
  BlogPost,
} from "./post-types";

const viDay = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function postDateLabel(iso: string): string {
  return viDay.format(new Date(iso));
}

export const BLOG_POSTS: BlogPost[] = [
  shopeeMaPost,
  freeshipPost,
  sachTikiPost,
  lazadaPost,
  tiktokLivestreamPost,
  sale1111Post,
  stackVoucherPost,
  toeicIeltsPost,
  tiktokSellerPost,
  routinePost,
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Blog posts whose tag or CTA points at a merchant landing page. */
export function postsForMerchant(merchant: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) =>
      post.tag.href === `/san/${merchant}` ||
      post.hintedCtas.some((cta) => cta.href === `/san/${merchant}`),
  ).slice(0, limit);
}

/** Blog posts whose tag or CTA points at a category landing page. */
export function postsForCategory(category: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter(
    (post) =>
      post.tag.href === `/danh-muc/${category}` ||
      post.hintedCtas.some((cta) => cta.href === `/danh-muc/${category}`),
  ).slice(0, limit);
}

/**
 * Pick a short reading list for a deal. Merchant matches come first, then
 * category matches; unknown deals fall back to the newest posts.
 */
export function postsForDeal(
  deal: { merchant?: string | null; category?: string | null },
  limit = 2,
): BlogPost[] {
  const picks: BlogPost[] = [];
  const add = (post: BlogPost) => {
    if (!picks.some((item) => item.slug === post.slug)) picks.push(post);
  };

  if (deal.merchant) postsForMerchant(deal.merchant, limit).forEach(add);
  if (deal.category) postsForCategory(deal.category, limit).forEach(add);

  return picks.length > 0 ? picks.slice(0, limit) : BLOG_POSTS.slice(0, limit);
}

export function postUrl(slug: string): string {
  return `/blog/${slug}`;
}
