import type { MetadataRoute } from "next";
import { getNewsWithFallback } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getNewsWithFallback();
  const base = (process.env.SITE_URL || "https://ai-news.example.com").replace(
    /\/$/,
    ""
  );

  const staticRoutes = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];

  const newsRoutes = items.slice(0, 200).map((item) => ({
    url: `${base}/news/${encodeURIComponent(item.id)}`,
    lastModified: new Date(item.publishedAt),
  }));

  return [...staticRoutes, ...newsRoutes];
}
