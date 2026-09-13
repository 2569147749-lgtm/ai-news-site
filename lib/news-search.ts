import type { NewsItem } from "./types";

export interface SearchResult {
  item: NewsItem;
  score: number;
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

const DOMAIN_TERMS = [
  "具身智能",
  "大模型",
  "智能体",
  "工作流",
  "多模态",
  "机器人",
  "产品",
  "模型",
  "推理",
  "开源",
  "应用",
  "发布",
  "agent",
  "rag",
  "openai",
  "anthropic",
  "claude",
  "gemini",
  "deepseek",
];

function getTokens(query: string) {
  const normalized = normalize(query);
  const explicitTokens = normalized
    .split(/[\s,，、;；/]+/)
    .filter((token) => token.length > 0);
  const domainTokens = DOMAIN_TERMS.filter(
    (term) => normalized !== term && normalized.includes(term)
  );

  return [...new Set([...explicitTokens, ...domainTokens])];
}

function recencyScore(item: NewsItem, now: Date) {
  const timestamp = Date.parse(item.publishedAt);
  if (!Number.isFinite(timestamp)) return 0;

  const ageHours = Math.max(0, (now.getTime() - timestamp) / 3_600_000);
  if (ageHours <= 24) return 12;
  if (ageHours <= 72) return 6;
  return 0;
}

function exactScore(item: NewsItem, phrase: string) {
  const title = normalize(item.title);
  const summary = normalize(item.summary);
  const source = normalize(item.source);
  const tags = item.tags.map(normalize);
  const content = normalize(item.content || "");
  const compactPhrase = phrase.replace(/\s+/g, "");
  const compactTitle = title.replace(/\s+/g, "");
  let score = 0;

  if (compactTitle === compactPhrase) score += 1_200;
  else if (compactTitle.startsWith(compactPhrase)) score += 900;
  else if (compactTitle.includes(compactPhrase)) score += 700;
  if (summary.includes(phrase)) score += 240;
  if (source.includes(phrase)) score += 180;
  if (tags.some((tag) => tag.includes(phrase))) score += 200;
  if (content.includes(phrase)) score += 120;
  return score;
}

function broadScore(item: NewsItem, tokens: string[]) {
  const title = normalize(item.title);
  const summary = normalize(item.summary);
  const source = normalize(item.source);
  const tags = item.tags.map(normalize);
  const content = normalize(item.content || "");
  let score = 0;
  let matchedTokens = 0;

  for (const token of tokens) {
    let matched = false;
    if (title.includes(token)) {
      score += title.startsWith(token) ? 180 : 130;
      matched = true;
    }
    if (summary.includes(token)) {
      score += 35;
      matched = true;
    }
    if (source.includes(token)) {
      score += 60;
      matched = true;
    }
    if (tags.some((tag) => tag.includes(token))) {
      score += 75;
      matched = true;
    }
    if (content.includes(token)) {
      score += 20;
      matched = true;
    }
    if (matched) matchedTokens += 1;
  }

  if (matchedTokens === tokens.length && tokens.length > 1) {
    score += 260;
  } else if (matchedTokens > 0) {
    score += matchedTokens * 20;
  }

  return { score, matchedTokens };
}

export function searchNewsItems(
  items: NewsItem[],
  query: string,
  now = new Date()
): SearchResult[] {
  const phrase = normalize(query);
  if (!phrase) return [];
  const tokens = getTokens(query);

  return items
    .flatMap((item) => {
      const exact = exactScore(item, phrase);
      const broad = broadScore(item, tokens).score;
      if (exact === 0 && broad === 0) return [];
      return [
        {
          item,
          score: exact + broad + recencyScore(item, now),
          exactMatch: exact > 0,
        },
      ];
    })
    .sort(
      (left, right) =>
        Number(right.exactMatch) - Number(left.exactMatch) ||
        right.score - left.score ||
        Date.parse(right.item.publishedAt) - Date.parse(left.item.publishedAt)
    )
    .map(({ item, score }) => ({ item, score }));
}

function trendScore(item: NewsItem, now: Date) {
  const timestamp = Date.parse(item.publishedAt);
  const ageHours = Number.isFinite(timestamp)
    ? Math.max(0, (now.getTime() - timestamp) / 3_600_000)
    : Number.POSITIVE_INFINITY;
  const freshness =
    ageHours <= 6 ? 100 :
    ageHours <= 24 ? 82 :
    ageHours <= 72 ? 58 :
    ageHours <= 7 * 24 ? 32 : 8;
  const text = `${item.title} ${item.summary}`.toLowerCase();
  const highSignal = /发布|推出|上线|openai|claude|gemini|deepseek|大模型|智能体|机器人/.test(text)
    ? 18
    : 0;
  const tagSignal = Math.min(item.tags.length, 3) * 4;

  return freshness + highSignal + tagSignal;
}

export function getTrendingNewsItems(
  items: NewsItem[],
  now = new Date(),
  limit = 20
): SearchResult[] {
  return [...items]
    .map((item) => ({ item, score: trendScore(item, now) }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        Date.parse(right.item.publishedAt) - Date.parse(left.item.publishedAt)
    )
    .slice(0, limit);
}

export function getHomepageHighlights(
  items: NewsItem[],
  now = new Date(),
  limit = 5
): SearchResult[] {
  const trending = getTrendingNewsItems(items, now, items.length);
  const highlights: SearchResult[] = [];
  const selectedSources = new Set<string>();

  for (const result of trending) {
    if (selectedSources.has(result.item.source)) continue;

    highlights.push(result);
    selectedSources.add(result.item.source);
    if (highlights.length === limit) return highlights;
  }

  for (const result of trending) {
    if (highlights.some((highlight) => highlight.item.id === result.item.id)) {
      continue;
    }

    highlights.push(result);
    if (highlights.length === limit) break;
  }

  return highlights;
}
