import type { MetadataRoute } from "next";
import { listActiveDeals } from "@/lib/coupons/data";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const deals = await listActiveDeals({ limit: 1000 });
  return [
    { url: `${base}/`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/tim-kiem`, changeFrequency: "daily", priority: 0.5 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.5 },
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
