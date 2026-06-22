import type { MetadataRoute } from "next";
import { getNewsWithFallback } from "@/lib/data";
import { getAllDates } from "@/lib/kv";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getNewsWithFallback();
  const dates = getAllDates(items);
  const base = "https://ai-news.example.com";

  const staticRoutes = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    { url: `${base}/daily`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];

  const newsRoutes = items.slice(0, 200).map((item) => ({
    url: `${base}/news/${item.id}`,
    lastModified: new Date(item.publishedAt),
  }));

  const dailyRoutes = dates.map((date) => ({
    url: `${base}/daily/${date}`,
    lastModified: new Date(date),
  }));

  return [...staticRoutes, ...newsRoutes, ...dailyRoutes];
}
