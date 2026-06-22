/**
 * 文章内容提取器
 * 免费方案：Jina Reader（无需 API key，100 次/分钟额度）
 *  - 请求 https://r.jina.ai/ + 原文 URL
 *  - 返回 Markdown 格式的纯净正文（不含导航、广告）
 * 备份方案：自己 fetch + 正则抽取标题/段落（简单但够兜底）
 */

const JINA_ENDPOINT = "https://r.jina.ai/";

export interface ExtractedArticle {
  title?: string;
  content: string;
  source: "jina" | "fallback";
}

/**
 * 从任意文章 URL 提取正文。优先 Jina Reader，失败用简易 fallback。
 */
export async function extractArticle(url: string): Promise<ExtractedArticle | null> {
  if (!url) return null;

  // —— 方案 1：Jina Reader（零配置，效果最好） ——
  try {
    const jinaUrl = JINA_ENDPOINT + url;
    const response = await fetch(jinaUrl, {
      headers: {
        Accept: "text/plain",
        "User-Agent": "AuraDailyBot/1.0",
      },
      // 允许 Next.js 缓存 24 小时，避免对同一篇文章反复请求
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(15000),
    });

    if (response.ok) {
      const text = await response.text();
      const trimmed = text.trim();
      if (trimmed && trimmed.length > 200) {
        return {
          title: extractTitleFromMarkdown(trimmed),
          content: trimJinaPrefix(trimmed),
          source: "jina",
        };
      }
    }
  } catch {
    // Jina 失败，走 fallback
  }

  // —— 方案 2：fetch 原文 + 简易 HTML 抽取（兜底） ——
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AuraDailyBot/1.0)",
        Accept: "text/html",
      },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const html = await response.text();
    const content = extractTextFromHtml(html);
    if (content && content.length > 200) {
      return {
        title: extractHtmlTitle(html),
        content,
        source: "fallback",
      };
    }
  } catch {
    // 彻底失败
  }

  return null;
}

/** 去掉 Jina 返回文本开头的 "Title: ..." / "URL: ..." 等元数据行 */
function trimJinaPrefix(text: string): string {
  // Jina 返回格式通常是多行 Markdown，第一行是 # Title，之后是正文
  // 直接返回全文即可，只是简单过滤一下头部元数据
  const lines = text.split("\n");
  // 如果前 5 行是纯元数据行（Title: / URL: / Published Time: / ...），跳过
  const metadataKeys = ["title:", "url:", "published time:", "publisher:"];
  let skipN = 0;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim().toLowerCase();
    if (metadataKeys.some((k) => line.startsWith(k))) {
      skipN = i + 1;
    } else if (line === "") {
      // 空行也跳过
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

/** 超简易 HTML → 文本：只保留 <p> 和 <h1~h3> 里的文本 */
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
