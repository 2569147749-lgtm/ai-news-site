import { NewsItem } from "./types";
import { crawlAllSources } from "./rss";
import { getDemoNews } from "./demo-data";
import {
  getStoredNews as kvGetAll,
  replaceNews as kvReplace,
  saveNews as kvSave,
} from "./kv";
import { isValidDate } from "./news-date";
import {
  decodeNewsId,
  NEWS_RETENTION_LIMIT,
  retainNewsItems,
} from "./news-cache";

/**
 * 数据层 v2 — 三级缓存架构：
 *  1. 进程内内存缓存（最快，同请求复用）
 *  2. Vercel KV（跨请求/跨实例共享，预抓取主存储）
 *  3. 实时 RSS 抓取（兜底 + 更新）
 *
 * 设计目标：用户访问时 99% 情况直接从 KV 读（毫秒级响应），
 *           后台 Cron 定时预抓取更新 KV。
 */

const CACHE_VERSION = "v3-20260623";
const MEM_CACHE_TTL_MS = 60 * 1000; // 内存缓存 1 分钟

interface MemCacheEntry {
  version: string;
  items: NewsItem[];
  fetchedAt: number;
}

const cacheStore = globalThis as typeof globalThis & {
  __aiNewsMemCache?: MemCacheEntry | null;
};

function getMemCache() {
  return cacheStore.__aiNewsMemCache ?? null;
}

function setMemCache(entry: MemCacheEntry | null) {
  cacheStore.__aiNewsMemCache = entry;
}

/* ============ 工具函数 ============ */

function sortByDateDesc(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const aTimestamp = getItemTimestamp(a);
    const bTimestamp = getItemTimestamp(b);
    return bTimestamp - aTimestamp;
  });
}

function getItemTimestamp(item: Pick<NewsItem, "publishedAt" | "fetchedAt">) {
  if (isValidDate(item.publishedAt)) {
    return new Date(item.publishedAt).getTime();
  }

  return isValidDate(item.fetchedAt)
    ? new Date(item.fetchedAt).getTime()
    : 0;
}

async function fetchFreshFromRss(): Promise<NewsItem[]> {
  try {
    const result = await crawlAllSources();
    if (result.total > 0) {
      const sorted = sortByDateDesc(result.items).slice(0, NEWS_RETENTION_LIMIT);
      return sorted;
    }
  } catch (err) {
    console.error("[data] RSS crawl failed:", err);
  }
  return [];
}

/* ============ 对外 API ============ */

/**
 * 获取全部文章（三级缓存）
 * 优先级：内存 → KV → 实时 RSS 抓取 → 开发环境 demo 数据
 */
export async function getNewsWithFallback(): Promise<NewsItem[]> {
  const now = Date.now();
  const memCache = getMemCache();

  // —— 第 1 级：进程内内存缓存 ——
  if (
    memCache &&
    memCache.version === CACHE_VERSION &&
    now - memCache.fetchedAt < MEM_CACHE_TTL_MS
  ) {
    return memCache.items;
  }

  // —— 第 2 级：Vercel KV（预抓取架构的核心） ——
  try {
    const kvItems = await kvGetAll();
    if (kvItems && kvItems.length > 0) {
      const sorted = sortByDateDesc(kvItems);

      // 更新内存缓存
      setMemCache({
        version: CACHE_VERSION,
        items: sorted,
        fetchedAt: now,
      });

      return sorted;
    }
  } catch (err) {
    console.warn("[data] KV read failed, falling through to RSS:", err);
  }

  // —— 第 3 级：实时抓取（冷启动 / 无 KV 环境） ——
  const freshItems = await fetchFreshFromRss();

  if (freshItems.length > 0) {
    const retainedItems = retainNewsItems(
      freshItems,
      memCache?.items || [],
      NEWS_RETENTION_LIMIT
    );

    // 同时存进内存和 KV
    setMemCache({
      version: CACHE_VERSION,
      items: retainedItems,
      fetchedAt: now,
    });
    try {
      await kvSave(retainedItems);
    } catch {
      /* KV 失败不影响返回 */
    }
    return retainedItems;
  }

  // —— 最后兜底：demo 数据只允许用于本地开发 ——
  if (process.env.NODE_ENV !== "production") {
    const demo = getDemoNews();
    setMemCache({ version: CACHE_VERSION, items: demo, fetchedAt: now });
    return demo;
  }

  return [];
}

/** 取单条文章（用于详情页）——复用上面的三级缓存 */
export async function getNewsItemById(id: string): Promise<NewsItem | null> {
  const normalizedId = decodeNewsId(id);

  // Prefer the shared cache even after its refresh TTL. A card can remain open
  // while one source temporarily omits that article in its next feed response.
  const cachedItem = getMemCache()?.items.find(
    (item) => item.id === normalizedId
  );
  if (cachedItem) {
    return cachedItem;
  }

  const items = await getNewsWithFallback();
  return items.find((item) => item.id === normalizedId) || null;
}

/**
 * 强制刷新（清所有缓存 + 重新抓取 + 存 KV）
 * 供 /api/crawl 路由和 Cron 调用
 */
export async function refreshNews(): Promise<{
  items: NewsItem[];
  total: number;
  perSource: Record<string, number>;
  saved: boolean;
  fallback: boolean;
}> {
  const memoryItems = getMemCache()?.items || [];
  setMemCache(null);
  const result = await crawlAllSources();

  if (result.total > 0) {
    const now = Date.now();
    let storedItems: NewsItem[] = [];
    try {
      storedItems = await kvGetAll();
    } catch {
      /* KV read failure does not block a refresh */
    }
    const freshItems = retainNewsItems(
      sortByDateDesc(result.items),
      [...memoryItems, ...storedItems],
      NEWS_RETENTION_LIMIT
    );
    setMemCache({
      version: CACHE_VERSION,
      items: freshItems,
      fetchedAt: now,
    });
    let saved = false;
    try {
      saved = await kvReplace(freshItems);
    } catch {
      /* KV 失败不影响返回 */
    }
    return {
      items: freshItems,
      total: freshItems.length,
      perSource: result.perSource,
      saved,
      fallback: false,
    };
  }

  // 抓取失败 → 尝试返回已有缓存；生产环境不会伪造 demo 数据。
  const fallbackItems = await getNewsWithFallback();
  return {
    items: fallbackItems,
    total: fallbackItems.length,
    perSource: result.perSource,
    saved: false,
    fallback: true,
  };
}

export { getDemoNews };
