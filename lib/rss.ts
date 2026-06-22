import Parser from "rss-parser";
import { rssSources, RssSource } from "@/config/sources";
import { NewsItem } from "./types";
import { saveNews } from "./kv";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; AINewsBot/1.0; +https://example.com)",
  },
});

function genId(sourceId: string, rawLink: string, rawTitle: string): string {
  const content = (rawLink || rawTitle || Math.random().toString()).toString();
  const hash = Buffer.from(content)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12);
  return `${sourceId}-${hash}`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+(>|$)/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max = 240): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

function inferTags(title: string, summary: string): string[] {
  const keywords = [
    { tag: "大模型", patterns: ["gpt", "llm", "大模型", "large language model", "claude", "gemini"] },
    { tag: "多模态", patterns: ["多模态", "multimodal", "图像", "视频", "vision"] },
    { tag: "论文", patterns: ["paper", "论文", "arxiv", "研究", "research"] },
    { tag: "产品发布", patterns: ["launch", "发布", "推出", "release", "新功能"] },
    { tag: "开源", patterns: ["open source", "开源", "github"] },
    { tag: "政策", patterns: ["监管", "政策", "regulation", "法规"] },
  ];

  const text = (title + " " + summary).toLowerCase();
  const tags = new Set<string>();

  for (const { tag, patterns } of keywords) {
    if (patterns.some((p) => text.includes(p.toLowerCase()))) {
      tags.add(tag);
    }
  }

  return Array.from(tags);
}

export async function fetchFromSource(
  source: RssSource
): Promise<NewsItem[]> {
  try {
    const feed = await parser.parseURL(source.url);

    const items: NewsItem[] = [];
    const entries = feed.items?.slice(0, 15) || [];

    for (const item of entries) {
      const title = stripHtml(item.title || "").trim();
      const link = item.link || "";
      if (!title || !link) continue;

      const rawContent = stripHtml(
        (item as any).content ||
          (item as any)["content:encoded"] ||
          (item as any).contentSnippet ||
          item.description ||
          ""
      ).trim();

      const summary = truncate(rawContent, 240);
      const content = rawContent.length > 240 ? rawContent : "";

      const publishedAt = item.isoDate
        ? new Date(item.isoDate).toISOString()
        : item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString();

      items.push({
        id: genId(source.id, link, title),
        title,
        link,
        summary,
        content,
        source: source.name,
        sourceId: source.id,
        category: source.category,
        language: source.language,
        publishedAt,
        fetchedAt: new Date().toISOString(),
        tags: inferTags(title, summary),
      });
    }

    return items;
  } catch (err) {
    console.error(`[RSS] Failed to fetch ${source.name}:`, err);
    return [];
  }
}

export async function crawlAllSources(): Promise<{
  total: number;
  perSource: Record<string, number>;
}> {
  const results: NewsItem[] = [];
  const perSource: Record<string, number> = {};

  for (const source of rssSources) {
    const items = await fetchFromSource(source);
    results.push(...items);
    perSource[source.name] = items.length;
  }

  await saveNews(results);

  return {
    total: results.length,
    perSource,
  };
}
