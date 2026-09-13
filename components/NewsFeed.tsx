"use client";

import { useState } from "react";
import NewsCard from "@/components/NewsCard";
import type { NewsItem } from "@/lib/types";

interface NewsFeedProps {
  initialItems: NewsItem[];
  initialPage: number;
  initialHasMore: boolean;
  totalItems: number;
}

export default function NewsFeed({
  initialItems,
  initialPage,
  initialHasMore,
  totalItems,
}: NewsFeedProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError("");

    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/news?page=${nextPage}`);
      if (!response.ok) throw new Error("Unable to load news");

      const data = await response.json();
      setItems((current) => [...current, ...(data.items || [])]);
      setPage(data.page || nextPage);
      setHasMore(Boolean(data.hasMore));
      window.history.replaceState(null, "", `/?page=${data.page || nextPage}`);
    } catch {
      setError("加载失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-1 flex items-center justify-between border-b border-sand-edge pb-3">
        <h2 className="section-title">最新更新</h2>
        <span className="text-xs tabular-nums text-ink-dim">
          已显示 {items.length} / {totalItems} 篇
        </span>
      </div>
      {items.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
      {error && <p className="mt-5 text-center text-sm text-coral">{error}</p>}
      {hasMore && (
        <div className="pt-6 text-center">
          <button
            type="button"
            className="btn-secondary min-w-28"
            onClick={loadMore}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "正在加载…" : "加载更多"}
          </button>
        </div>
      )}
    </>
  );
}
