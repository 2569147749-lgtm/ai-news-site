import Parser from "rss-parser";
import { createHash } from "crypto";
import { getEnabledSources, RssSource } from "@/config/sources";
import { NewsItem } from "./types";
import { toIsoString } from "./news-date";
import { fetchFromPageSource } from "./source-page";
import { dedupeNewsItems } from "./news-dedupe";
import { htmlToArticleMarkdown } from "./article-markdown";
import { cleanNewsSummary } from "./news-summary";

export const RSS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent": RSS_USER_AGENT,
  },
});

/**
 * 稳定、唯一的文章 ID 生成器
 * 只依赖：sourceId + link + title（这三个字段在 RSS 源中是稳定不变的）
 * 不依赖正文内容（正文长度或 HTML 标记变化不影响 ID）
 * 保证：
 * 1. 同一篇文章多次抓取 → ID 始终相同（链接稳定）
 * 2. 不同文章（标题或链接不同）→ ID 绝对不同（SHA-256 碰撞概率≈0）
 * 3. 与文章在 feed 中的位置无关
 */
function genId(sourceId: string, rawLink: string, rawTitle: string): string {
  const base = `${sourceId}||${rawLink || ""}||${rawTitle || ""}`;

  const hash = createHash("sha256")
    .update(base, "utf8")
    .digest("hex")
    .slice(0, 16);

  // 加上简短标题 slug，便于人工识别
  const titleSlug = (rawTitle || "")
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "")
    .slice(0, 10)
    .toLowerCase();

  return `${sourceId}-${hash}${titleSlug ? "-" + titleSlug : ""}`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<\/?[^>]+(>|$)/g, " ")
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

/** 抓取单个 RSS 源 */
export async function fetchFromSource(
  source: RssSource
): Promise<NewsItem[]> {
  if (source.type === "page") {
    return fetchFromPageSource(source);
  }

  try {
    const feed = await parser.parseURL(source.url);
    const items: NewsItem[] = [];
    const entries = feed.items?.slice(0, 15) || [];

    for (const item of entries) {
      const title = cleanNewsSummary(stripHtml(item.title || ""));
      const link = item.link || "";
      if (!title || !link) continue;

      const rawMarkup =
        (item as any).content ||
        (item as any)["content:encoded"] ||
        (item as any).contentSnippet ||
        item.description ||
        "";
      const rawContent = cleanNewsSummary(stripHtml(rawMarkup));

      const summary = truncate(rawContent, 240);
      // RSS 提供完整 HTML 时，保留它的分段、标题和图片；否则详情页再抓原文。
      const structuredContent = /<\w+/i.test(rawMarkup)
        ? htmlToArticleMarkdown(rawMarkup, link)
        : "";
      const content = structuredContent.length > 300 ? structuredContent : "";

      const fetchedAt = new Date().toISOString();
      const publishedAt =
        toIsoString(item.isoDate || item.pubDate || "") || fetchedAt;

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
        fetchedAt,
        tags: inferTags(title, summary),
      });
    }
    if (!source.keywords?.length) {
      return items;
    }

    return items.filter((item) => {
      const text = `${item.title} ${item.summary}`.toLowerCase();
      return source.keywords!.some((keyword) =>
        text.includes(keyword.toLowerCase())
      );
    });
  } catch (err) {
    console.error(`[RSS] Failed to fetch ${source.name}:`, err);
    return [];
  }
}

/** 并行抓取全部 RSS 源（含并发限制，避免被封） */
export async function crawlAllSources(): Promise<{
  items: NewsItem[];
  total: number;
  perSource: Record<string, number>;
}> {
  const results: NewsItem[] = [];
  const perSource: Record<string, number> = {};
  const concurrency = 3; // 同时最多 3 个，避免源站拒绝
  const GLOBAL_TIMEOUT_MS = 20000; // 整体抓取最多 20 秒，超时就返回已抓到的内容
  const startTime = Date.now();

  const sources = getEnabledSources();

  for (let i = 0; i < sources.length; i += concurrency) {
    if (Date.now() - startTime > GLOBAL_TIMEOUT_MS) {
      // 全局超时 —— 返回已经抓到的内容，不再等慢源
      break;
    }

    const batch = sources.slice(i, i + concurrency);
    const remainingTime = Math.max(
      1000,
      GLOBAL_TIMEOUT_MS - (Date.now() - startTime)
    );

    // 给每批加上独立超时（单个源最多 8 秒，批整体不超剩余时间）
    const batchPromise = Promise.allSettled(
      batch.map((s) => fetchFromSource(s))
    );
    const timeoutPromise = new Promise<never>((_, rej) =>
      setTimeout(() => rej("batch_timeout"), remainingTime)
    );

    let batchResults: PromiseSettledResult<NewsItem[]>[];
    try {
      batchResults = (await Promise.race([batchPromise, timeoutPromise])) as any;
    } catch {
      // 本批超时 —— 全部置 0，继续下一批
      batch.forEach((s) => (perSource[s.name] = perSource[s.name] || 0));
      continue;
    }

    batchResults.forEach((r, idx) => {
      const source = batch[idx];
      if (r.status === "fulfilled") {
        results.push(...r.value);
        perSource[source.name] = r.value.length;
      } else {
        perSource[source.name] = 0;
      }
    });
  }

  // 同链接、同标题或高度相似标题的转载只保留最先抓到的一条。
  const deduped = dedupeNewsItems(results);

  return {
    items: deduped,
    total: deduped.length,
    perSource,
  };
}
