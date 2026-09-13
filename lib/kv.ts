import { NewsItem } from "./types";
import { getDemoNews } from "./demo-data";
import { getShanghaiDate, isValidDate } from "./news-date";
import { NEWS_RETENTION_LIMIT } from "./news-cache";
import { rssSources } from "@/config/sources";

const NEWS_KEY = "news_items";
const activeSourceIds = new Set(rssSources.map((source) => source.id));

let inMemoryCache: NewsItem[] | null = null;
let cacheFetchedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 10;

/* ---- 安全的环境变量检查 ---- */
function getEnvVar(name: string): string | null {
  try {
    if (typeof process !== "undefined" && process.env?.[name]) {
      return process.env[name]!;
    }
    return null;
  } catch {
    return null;
  }
}

/* ---- 是否有 Vercel KV 环境变量 ---- */
function hasKv(): boolean {
  return !!getEnvVar("KV_REST_API_URL");
}

/* ---- 按排序辅助 ---- */
function sortByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (a, b) => getItemTimestamp(b) - getItemTimestamp(a)
  );
}

function getItemTimestamp(item: Pick<NewsItem, "publishedAt" | "fetchedAt">) {
  if (isValidDate(item.publishedAt)) {
    return new Date(item.publishedAt).getTime();
  }

  return isValidDate(item.fetchedAt)
    ? new Date(item.fetchedAt).getTime()
    : 0;
}

/* ---- KV 读 ---- */
async function kvGet<T>(key: string): Promise<T | null> {
  try {
    const url = getEnvVar("KV_REST_API_URL");
    const token = getEnvVar("KV_REST_API_TOKEN");
    if (!url || !token) return null;

    const res = await fetch(`${url}/get/${key}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ? (JSON.parse(data.result) as T) : null;
  } catch {
    return null;
  }
}

/* ---- KV 写 ---- */
async function kvSet(key: string, value: unknown): Promise<boolean> {
  try {
    const url = getEnvVar("KV_REST_API_URL");
    const token = getEnvVar("KV_REST_API_TOKEN");
    if (!url || !token) return false;

    const body = JSON.stringify(value);
    const res = await fetch(`${url}/set/${key}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ============ 对外 API ============ */

export async function getStoredNews(): Promise<NewsItem[]> {
  const now = Date.now();

  if (inMemoryCache && now - cacheFetchedAt < CACHE_TTL_MS) {
    return inMemoryCache;
  }

  if (!hasKv()) {
    return [];
  }

  const stored = await kvGet<NewsItem[]>(NEWS_KEY);
  if (!Array.isArray(stored) || stored.length === 0) {
    return [];
  }

  const items = sortByDateDesc(
    stored.filter((item) => activeSourceIds.has(item.sourceId))
  );
  inMemoryCache = items;
  cacheFetchedAt = now;

  return items;
}

export async function getAllNews(): Promise<NewsItem[]> {
  const stored = await getStoredNews();
  if (stored.length > 0 || process.env.NODE_ENV === "production") {
    return stored;
  }

  return getDemoNews();
}

export async function saveNews(items: NewsItem[]): Promise<boolean> {
  const existing = await getStoredNews();
  const seen = new Set(existing.map((i) => i.id));

  for (const item of items) {
    if (!seen.has(item.id)) {
      existing.unshift(item);
    }
  }

  const sorted = sortByDateDesc(existing).slice(0, NEWS_RETENTION_LIMIT);

  inMemoryCache = sorted;
  cacheFetchedAt = Date.now();

  if (hasKv()) {
    return kvSet(NEWS_KEY, sorted);
  }

  return false;
}

export async function replaceNews(items: NewsItem[]): Promise<boolean> {
  const sorted = sortByDateDesc(items)
    .filter((item) => activeSourceIds.has(item.sourceId))
    .slice(0, NEWS_RETENTION_LIMIT);

  inMemoryCache = sorted;
  cacheFetchedAt = Date.now();

  return hasKv() ? kvSet(NEWS_KEY, sorted) : false;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const all = await getAllNews();
  return all.find((i) => i.id === slug) || null;
}

export async function searchNews(query: string): Promise<NewsItem[]> {
  const all = await getAllNews();
  const q = query.toLowerCase();
  return all.filter(
    (i) =>
      i.title.toLowerCase().includes(q) ||
      i.summary.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q)) ||
      i.source.toLowerCase().includes(q)
  );
}

export async function getDailyReport(date: string): Promise<NewsItem[]> {
  const all = await getAllNews();
  return all.filter(
    (i) => isValidDate(i.publishedAt) && getShanghaiDate(i.publishedAt) === date
  );
}

export function getAllDates(items: NewsItem[]): string[] {
  const set = new Set<string>();
  for (const i of items) {
    if (isValidDate(i.publishedAt)) {
      set.add(getShanghaiDate(i.publishedAt));
    }
  }
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}
