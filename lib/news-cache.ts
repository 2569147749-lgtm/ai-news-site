import type { NewsItem } from "./types";

export const NEWS_RETENTION_LIMIT = 500;

export function decodeNewsId(id: string) {
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

export function retainNewsItems(
  freshItems: NewsItem[],
  previousItems: NewsItem[],
  limit: number
): NewsItem[] {
  const byId = new Map<string, NewsItem>();

  for (const item of [...freshItems, ...previousItems]) {
    if (!byId.has(item.id)) {
      byId.set(item.id, item);
    }
  }

  return [...byId.values()]
    .sort((a, b) => {
      const aTimestamp = Date.parse(a.publishedAt) || Date.parse(a.fetchedAt) || 0;
      const bTimestamp = Date.parse(b.publishedAt) || Date.parse(b.fetchedAt) || 0;
      return bTimestamp - aTimestamp;
    })
    .slice(0, limit);
}
