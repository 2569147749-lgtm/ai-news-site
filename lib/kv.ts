import { NewsItem } from "./types";
import { getDemoNews } from "./demo-data";

const NEWS_KEY = "news_items";
const MAX_ITEMS = 200;

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
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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

export async function getAllNews(): Promise<NewsItem[]> {
  const now = Date.now();

  if (inMemoryCache && now - cacheFetchedAt < CACHE_TTL_MS) {
    return inMemoryCache;
  }

  let items: NewsItem[] = [];

  if (hasKv()) {
    const stored = await kvGet<NewsItem[]>(NEWS_KEY);
    if (stored) items = stored;
  }

  /* 无 KV 环境 / KV 暂无数据时，fallback 到内置 demo 数据 */
  if (items.length === 0) {
    items = getDemoNews();
  } else {
    items = sortByDateDesc(items);
  }

  inMemoryCache = items;
  cacheFetchedAt = now;

  return items;
}

export async function saveNews(items: NewsItem[]): Promise<void> {
  const existing = (await getAllNews()) || [];
  const seen = new Set(existing.map((i) => i.id));

  for (const item of items) {
    if (!seen.has(item.id)) {
      existing.unshift(item);
    }
  }

  const sorted = sortByDateDesc(existing).slice(0, MAX_ITEMS);

  inMemoryCache = sorted;
  cacheFetchedAt = Date.now();

  if (hasKv()) {
    await kvSet(NEWS_KEY, sorted);
  }
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
  return all.filter((i) => i.publishedAt.slice(0, 10) === date);
}

export function getAllDates(items: NewsItem[]): string[] {
  const set = new Set<string>();
  for (const i of items) {
    set.add(i.publishedAt.slice(0, 10));
  }
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}
