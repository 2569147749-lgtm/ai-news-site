import { createHash } from "crypto";
import * as cheerio from "cheerio";
import { RssSource } from "@/config/sources";
import { NewsItem } from "./types";
import { toIsoString } from "./news-date";

const MAX_ITEMS_PER_SOURCE = 15;
const REQUEST_TIMEOUT_MS = 5_000;

function createItemId(sourceId: string, link: string, title: string) {
  const hash = createHash("sha256")
    .update(`${sourceId}||${link}||${title}`, "utf8")
    .digest("hex")
    .slice(0, 16);

  return `${sourceId}-${hash}`;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function inferTags(title: string, summary: string): string[] {
  const text = `${title} ${summary}`.toLowerCase();
  const tags = [
    ["大模型", ["大模型", "llm", "gpt", "claude", "gemini", "deepseek"]],
    ["智能体", ["智能体", "agent", "工作流"]],
    ["AI 产品", ["产品", "应用", "工具", "上线", "发布"]],
    ["具身智能", ["机器人", "具身", "自动驾驶"]],
  ] as const;

  return tags
    .filter(([, patterns]) => patterns.some((pattern) => text.includes(pattern)))
    .map(([tag]) => tag);
}

function toNewsItem(
  source: RssSource,
  title: string,
  link: string,
  summary: string,
  publishedAt?: string
): NewsItem {
  const fetchedAt = new Date().toISOString();

  return {
    id: createItemId(source.id, link, title),
    title,
    link,
    summary,
    source: source.name,
    sourceId: source.id,
    category: source.category,
    language: source.language,
    publishedAt: toIsoString(publishedAt || "") || fetchedAt,
    fetchedAt,
    tags: inferTags(title, summary),
  };
}

export function parseSourcePageHtml(
  html: string,
  source: RssSource
): NewsItem[] {
  const $ = cheerio.load(html);
  const prefix = source.articlePathPrefix || "/";
  const items = new Map<string, NewsItem>();

  $(`a[href^="${prefix}"]`).each((_, element) => {
    const anchor = $(element);
    const title = cleanText(anchor.text());
    const href = anchor.attr("href") || "";
    if (!title || title.length < 8 || items.size >= MAX_ITEMS_PER_SOURCE) {
      return;
    }

    const link = new URL(href, source.url).toString();
    const container = anchor.closest("article, li, section, div");
    const summary = cleanText(
      container.find("p").first().text() || container.text()
    )
      .replace(title, "")
      .slice(0, 240);
    const date = container.find("time").first().attr("datetime") ||
      container.find("time").first().text();

    items.set(link, toNewsItem(source, title, link, summary, date));
  });

  return [...items.values()];
}

async function requestText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AuraDailyBot/1.0)",
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.9",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

export async function fetchFromPageSource(source: RssSource) {
  try {
    const html = await requestText(source.url);
    return parseSourcePageHtml(html, source);
  } catch (error) {
    console.error(`[source-page] Failed to fetch ${source.name}:`, error);
    return [];
  }
}
