/**
 * 文章内容提取器 v3 — 三阶梯队（超轻量，Next.js 完美兼容）
 *  1. 本地 Cheerio 启发式提取（最快，无额外依赖问题）
 *  2. Jina Reader API（质量好，处理复杂站）— 兜底
 *  3. 简易 HTML 正则提取（最后兜底）
 *
 * 为什么不用 jsdom + Readability：
 *  - jsdom 太重，在 Next.js Server Components 里有 webpack 兼容性问题
 *  - cheerio 超轻量，100% 兼容所有 Node.js / Edge 环境
 *  - 启发式算法对 90%+ 的新闻站点效果足够好
 */

import * as cheerio from "cheerio";
import { htmlToArticleMarkdown } from "./article-markdown";

const JINA_ENDPOINT = "https://r.jina.ai/";

export interface ExtractedArticle {
  title?: string;
  content: string;
  source: "cheerio" | "jina" | "fallback";
}

const EXTRACT_TIMEOUT_MS = 8000;

export function getSourceArticleSelectors(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, "");

  if (host === "qbitai.com") {
    return [".article-content", ".post-content", ".content"];
  }
  if (host === "huxiu.com") {
    return [".article-content", "[class*='article-content']", "article"];
  }
  if (host === "leiphone.com") {
    return [".article-content", ".article_content", ".content"];
  }
  if (host === "geekpark.net") {
    return [".article-content", ".articleContent", "article"];
  }

  return [];
}

export async function extractArticle(
  url: string
): Promise<ExtractedArticle | null> {
  if (!url) return null;

  // —— 第 1 梯队：本地 Cheerio 启发式提取（最快） ——
  try {
    const result = await extractWithCheerio(url);
    if (result && result.content.length > 300) {
      return result;
    }
  } catch {
    // 失败，继续下一个梯队
  }

  // —— 第 2 梯队：Jina Reader（处理复杂站 / 反爬站） ——
  try {
    const result = await extractWithJina(url);
    if (result && result.content.length > 300) {
      return result;
    }
  } catch {
    // 失败，继续下一个梯队
  }

  // —— 第 3 梯队：简易 HTML 提取（最后兜底） ——
  try {
    const result = await extractWithSimpleHtml(url);
    if (result && result.content.length > 200) {
      return result;
    }
  } catch {
    // 彻底失败
  }

  return null;
}

/* ================================================================
   梯队 1：Cheerio 启发式正文提取
   思路：
   - 先清掉噪音节点（nav/header/footer/aside/script/style 等）
   - 给所有候选容器打分（段落数 × 文字密度）
   - 选得分最高的容器作为正文区域
   ================================================================ */
async function extractWithCheerio(
  url: string
): Promise<ExtractedArticle | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    EXTRACT_TIMEOUT_MS
  );

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      },
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1) 提取标题
    const title =
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      undefined;

    // 2) 清理噪音节点
    const noisySelectors = [
      "script",
      "style",
      "noscript",
      "nav",
      "header",
      "footer",
      "aside",
      ".sidebar",
      ".nav",
      ".menu",
      ".comment",
      ".comments",
      ".ad",
      ".ads",
      ".advertisement",
      ".social",
      ".share",
      ".related",
      ".recommend",
      ".widget",
      ".cookie",
      ".banner",
      "#comments",
      "#sidebar",
      "#nav",
      "#header",
      "#footer",
    ];
    $(noisySelectors.join(",")).remove();

    const sourceSelectors = getSourceArticleSelectors(url);
    for (const selector of sourceSelectors) {
      const candidate = $(selector).first();
      if (candidate.length === 0 || candidate.text().trim().length < 200) {
        continue;
      }

      const content = htmlToArticleMarkdown(candidate.html() || "", url);
      if (content.length >= 200) {
        return { title, content, source: "cheerio" };
      }
    }

    // 3) 候选容器：包含 <p> 的块级元素
    const candidates: {
      el: cheerio.Cheerio<any>;
      score: number;
      textLen: number;
      pCount: number;
    }[] = [];

    $("article, main, .post, .article, .content, .entry, .story, div, section").each(
      (_, elem) => {
        const $el = $(elem);
        const $ps = $el.find("p");
        const pCount = $ps.length;
        if (pCount < 3) return; // 段落太少，跳过

        // 计算纯文本长度
        const text = $el.text().trim();
        const textLen = text.length;
        if (textLen < 200) return; // 文字太少，跳过

        // 计算链接密度（链接文字 / 总文字）— 越低越可能是正文
        const linkText = $el.find("a").text().length;
        const linkDensity = textLen > 0 ? linkText / textLen : 1;
        if (linkDensity > 0.5) return; // 链接太多，很可能是列表页

        // 打分公式：段落数 × 文字长度 × (1 - 链接密度)
        const score = pCount * textLen * (1 - linkDensity);
        candidates.push({ el: $el, score, textLen, pCount });
      }
    );

    if (candidates.length === 0) return null;

    // 4) 选得分最高的
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    // 5) 将正文语义化为 Markdown，保留标题、段落、引用、列表和图片。
    const content = htmlToArticleMarkdown(best.el.html() || "", url);
    if (content.length < 200) return null;

    return {
      title,
      content,
      source: "cheerio",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/* ================================================================
   梯队 2：Jina Reader API（兜底复杂站点）
   ================================================================ */
async function extractWithJina(
  url: string
): Promise<ExtractedArticle | null> {
  try {
    const jinaUrl = JINA_ENDPOINT + url;
    const response = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "User-Agent": "AuraDailyBot/2.0",
      },
      signal: AbortSignal.timeout(EXTRACT_TIMEOUT_MS),
    });

    if (!response.ok) return null;

    const text = await response.text();
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 200) return null;

    return {
      title: extractTitleFromMarkdown(trimmed),
      content: trimJinaPrefix(trimmed),
      source: "jina",
    };
  } catch {
    return null;
  }
}

/* ================================================================
   梯队 3：简易 HTML 提取（最后兜底）
   ================================================================ */
async function extractWithSimpleHtml(
  url: string
): Promise<ExtractedArticle | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AuraDailyBot/2.0)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(EXTRACT_TIMEOUT_MS),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const content = htmlToArticleMarkdown(html, url) || extractTextFromHtml(html);
    if (!content || content.length < 200) return null;

    return {
      title: extractHtmlTitle(html),
      content,
      source: "fallback",
    };
  } catch {
    return null;
  }
}

/* ================================================================
   辅助函数
   ================================================================ */

function trimJinaPrefix(text: string): string {
  const lines = text.split("\n");
  const metadataKeys = [
    "title:",
    "url:",
    "published time:",
    "publisher:",
    "author:",
  ];
  let skipN = 0;
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim().toLowerCase();
    if (metadataKeys.some((k) => line.startsWith(k))) {
      skipN = i + 1;
    } else if (line === "") {
      if (skipN === i) skipN = i + 1;
    } else {
      break;
    }
  }
  return lines.slice(skipN).join("\n").trim();
}

function extractTitleFromMarkdown(md: string): string | undefined {
  const firstHeading = md.match(/^#\s+(.+)$/m);
  return firstHeading ? firstHeading[1].trim() : undefined;
}

function extractHtmlTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim() : undefined;
}

function extractTextFromHtml(html: string): string {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "");

  const blocks: string[] = [];
  const blockRegex = /<(p|h[1-3])[\s>][\s\S]*?<\/\1>/gi;
  let match;
  while ((match = blockRegex.exec(cleaned)) !== null) {
    const text = match[0]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim();
    if (text && text.length > 20) blocks.push(text);
  }

  return blocks.join("\n\n");
}
