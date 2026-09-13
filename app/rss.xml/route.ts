import { getNewsWithFallback } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = await getNewsWithFallback();
  const base = (process.env.SITE_URL || "https://ai-news.example.com").replace(
    /\/$/,
    ""
  );
  const now = new Date().toUTCString();

  const itemsXml = items
    .slice(0, 50)
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary || "")}</description>
      <category>${escapeXml(item.category)}</category>
      <source>${escapeXml(item.source)}</source>
      <guid isPermaLink="false">${base}/news/${encodeURIComponent(item.id)}</guid>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI 日报 - 中文 AI 产品与行业资讯</title>
    <link>${base}</link>
    <description>聚合中文 AI 产品、行业与应用资讯，保留原始出处并提供阅读摘要。</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
