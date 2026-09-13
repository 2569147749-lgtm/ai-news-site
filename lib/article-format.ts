function isByline(value: string) {
  if (value.length > 120) return false;

  return (
    /(?:作者|记者|编辑|撰文|出品|策划|摄影|翻译)\s*[:：]/.test(value) ||
    /发自\s+.{2,80}(?:公众号|媒体|日报|财经|科技|AI|网|位)/.test(value) ||
    /(?:公众号|微信号|知乎|微博)\s*(?:[:：|]|[A-Za-z0-9_-]{2,})/.test(value) ||
    /^(?:来源|文\/|图\/)\s*[:：]/.test(value)
  );
}

export interface ArticleAttribution {
  publication?: string;
  author?: string;
}

function normalizeAttributionText(value: string) {
  return value
    .replace(/\[([^\]]+)]\((?:https?:\/\/)[^)]+\)/g, "$1")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function getArticleAttribution(
  value: string,
  fallbackPublication: string
): ArticleAttribution {
  const normalized = normalizeAttributionText(value.split(/\n{2,}/)[0] || "");
  const publication =
    normalized.match(/(?:本文来自)?(?:微信公众号|来源)\s*[:：]\s*([^，,。；;|｜]+)/)?.[1]?.trim() ||
    fallbackPublication;
  const author = normalized.match(
    /作者\s*[:：]\s*([\u4e00-\u9fffA-Za-z][\u4e00-\u9fffA-Za-z·_-]{1,18})(?=\s|[，,。；;|｜]|$)/
  )?.[1];

  return { publication, author };
}

export function stripArticleBoilerplate(value: string) {
  const [firstBlock = "", ...remainingBlocks] = value.split(/\n{2,}/);
  let result = normalizeAttributionText(firstBlock);

  result = result.replace(
    /^(?:本文来自)?(?:微信公众号|来源)\s*[:：]\s*[^，,。；;|｜]+\s*[，,]?\s*/,
    ""
  );
  result = result.replace(
    /^(?:(?:作者|编辑|记者|撰文)\s*[:：]\s*[\u4e00-\u9fffA-Za-z][\u4e00-\u9fffA-Za-z·_-]{1,18}\s*[，,]?\s*)+/,
    ""
  );
  result = result.replace(
    /^原文标题\s*[:：]\s*(?:《[\s\S]*?》|「[\s\S]*?」|“[\s\S]*?”)\s*[，,]?\s*/,
    ""
  );

  return [result.trim(), ...remainingBlocks]
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

export function enrichArticleMarkdown(markdown: string) {
  const blocks = markdown.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
  let bylineAdded = false;
  let previousWasMedia = false;

  return blocks
    .map((block) => {
      if (/^!\[/.test(block)) {
        previousWasMedia = true;
        return block;
      }

      if (/^>\s*\[来源信息\]\s*/.test(block)) {
        const byline = block.replace(/^>\s*\[来源信息\]\s*/, "").trim();
        previousWasMedia = false;
        return isByline(byline) ? "" : byline;
      }

      if (/^#{1,4}\s|^>\s|^-\s/.test(block)) {
        previousWasMedia = false;
        return block;
      }

      if (
        previousWasMedia &&
        block.length <= 160 &&
        /(?:图片来源|图源|图片|动图|视频).{0,12}(?:来源|供图|版权)|(?:视觉中国|Getty|Unsplash|Pocket)/i.test(block)
      ) {
        previousWasMedia = false;
        return `*${block}*`;
      }

      if (
        !previousWasMedia &&
        block.length <= 100 &&
        /^(?:图片来源|图源|图说|摄影|供图)\s*[:：]/.test(block)
      ) {
        return "";
      }

      previousWasMedia = false;

      if (
        !bylineAdded &&
        isByline(block)
      ) {
        bylineAdded = true;
        return "";
      }

      if (
        block.length <= 44 &&
        /(?:原来|听起来|啊[？?!！]|没想到|值得|怎么|为何)/.test(block)
      ) {
        return `> ${block}`;
      }

      return block;
    })
    .join("\n\n");
}
