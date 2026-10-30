import type { MetadataRoute } from "next";
import { listActiveDeals } from "@/lib/coupons/data";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { LEGAL_PAGES } from "@/lib/legal/content";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const deals = await listActiveDeals({ limit: 1000 });
  return [
    { url: `${base}/`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/tim-kiem`, changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/ve-chung-toi`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.3 },
    ...LEGAL_PAGES.map((page) => ({
      url: `${base}/chinh-sach/${page.slug}`,
      lastModified: new Date(page.updated),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...BLOG_POSTS.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...deals.map((deal) => ({
      url: `${base}/ma/${deal.id}`,
      lastModified: deal.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
