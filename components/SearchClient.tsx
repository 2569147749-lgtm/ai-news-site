"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NewsItem } from "@/lib/types";
import NewsCard from "@/components/NewsCard";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";
  const initialPage = Number(searchParams.get("page") || "1");

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [trending, setTrending] = useState(!initialQ);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setQuery(initialQ);

    const requestUrl = initialQ
      ? `/api/search?q=${encodeURIComponent(initialQ)}&page=${initialPage}`
      : `/api/search?page=${initialPage}`;
    fetch(requestUrl)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "搜索暂时不可用");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTrending(data.kind === "trending");
        setPage(data.page || 1);
        setTotalPages(data.totalPages || 1);
        setHasMore(Boolean(data.hasMore));
        setSearched(true);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setItems([]);
          setTotal(0);
          setSearched(true);
          setError(
            requestError instanceof Error ? requestError.message : "搜索暂时不可用"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialPage, initialQ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams();
    if (initialQ) params.set("q", initialQ);
    params.set("page", String(nextPage));
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div>
      <div className="site-shell max-w-5xl py-8 md:py-10">
        <div className="mb-8 border-b border-sand-edge pb-6">
          <p className="section-kicker">SEARCH</p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink-main md:text-3xl">搜索资讯</h1>

          <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                id="search"
                name="q"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索关键词、标题、标签…"
                autoComplete="off"
                aria-label="搜索资讯"
                className="w-full rounded-md border border-sand-edge px-4 py-2.5 text-sm text-ink-main placeholder:text-ink-dim focus:border-amber"
              />
            </div>
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              搜索
            </button>
          </form>

        </div>

        {searched && !loading && (
          !trending && (
            <div className="mb-8 text-center" role="status" aria-live="polite">
              <div className="inline-flex items-center gap-2 text-sm text-ink-sub">
                <span>“{initialQ}”</span>
                <span>共 {total} 条结果，按相关性排序</span>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="text-center py-16" aria-live="polite">
            <div className="inline-block h-7 w-7 animate-spin rounded-full border-[3px] border-sand-edge border-t-amber mb-4"></div>
            <div className="text-sm text-ink-sub">正在搜索</div>
          </div>
        )}

        {!loading && error && (
          <div className="border-y border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {!loading && items.length === 0 && searched && (
          <div className="border-y border-sand-edge p-10 text-center">
            <h3 className="text-xl font-bold text-ink-main mb-2">未找到匹配内容</h3>
            <p className="text-sm text-ink-sub">
              {error ? "请稍后重试。" : "换个关键词再试试？可以用更短的词"}
            </p>
          </div>
        )}

        <div className="mt-4">
          {!loading && items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        {!loading && searched && items.length > 0 && (
          <nav
            className="mt-7 flex items-center justify-center gap-3"
            aria-label="搜索结果分页"
          >
            {page > 1 && (
              <button type="button" className="btn-secondary" onClick={() => goToPage(page - 1)}>
                上一页
              </button>
            )}
            {(hasMore || page > 1) && (
              <span className="text-xs tabular-nums text-ink-dim">
                第 {page} / {totalPages} 页
              </span>
            )}
            {hasMore && (
              <button type="button" className="btn-secondary" onClick={() => goToPage(page + 1)}>
                下一页
              </button>
            )}
          </nav>
        )}
      </div>

      <div className="mt-12 pb-4 text-center">
        <Link href="/" className="text-xs text-ink-sub hover:text-ink-main">
          返回首页
        </Link>
      </div>
    </div>
  );
}
