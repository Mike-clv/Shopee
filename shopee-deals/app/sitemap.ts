import type { MetadataRoute } from "next";
import { listActiveDeals } from "@/lib/coupons/data";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const deals = await listActiveDeals(500);
  return [
    { url: `${base}/`, changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/tim-kiem`, changeFrequency: "daily", priority: 0.5 },
    ...deals.map((deal) => ({
      url: `${base}/ma/${deal.id}`,
      lastModified: deal.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
