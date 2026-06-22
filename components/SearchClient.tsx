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

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!initialQ) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(initialQ)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(data.items || []);
        setTotal(data.total || 0);
        setSearched(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialQ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="relative bg-sand-grid">
      <div className="relative max-w-5xl mx-auto px-4 py-14">
        <div className="mb-10 text-center">
          <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-3">// SEARCH ENGINE</div>
          <h1 className="text-3xl md:text-5xl font-black text-ink-main mb-4 tracking-tight">
            站内<span className="text-gradient-brand">搜索</span>
          </h1>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto mt-8">
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
                className="w-full px-5 py-3.5 bg-sand-card border border-sand-edge rounded-full text-ink-main placeholder:text-ink-dim focus:outline-none focus:border-amber-300 focus:shadow-float transition-all text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="btn-neon !px-6 !py-3.5 !text-sm whitespace-nowrap"
            >
              搜索
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-ink-sub font-mono">
            <span>建议搜索：</span>
            {["大模型", "论文", "多模态", "OpenAI", "Claude"].map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="px-2 py-0.5 rounded-full bg-sand-card border border-sand-edge hover:border-amber-300 hover:text-amber-700 hover:shadow-card transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                {kw}
              </Link>
            ))}
          </div>
        </div>

        {searched && !loading && (
          <div className="mb-8 text-center" role="status" aria-live="polite">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sand-edge bg-sand-card text-xs font-mono shadow-card">
              <span className="text-ink-sub">QUERY:</span>
              <span className="text-amber-700 font-semibold">&quot;{initialQ}&quot;</span>
              <span className="text-ink-dim">|</span>
              <span className="text-ink-sub">FOUND:</span>
              <span className="text-aqua font-bold">{total}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-16" aria-live="polite">
            <div className="inline-block w-8 h-8 border-[3px] border-amber-300/40 border-t-amber-700 rounded-full animate-spin mb-4"></div>
            <div className="text-aqua font-mono text-sm">SEARCHING…</div>
          </div>
        )}

        {!loading && items.length === 0 && searched && (
          <div className="bg-sand-card border border-sand-edge rounded-2xl shadow-card hover:border-amber-300 hover:shadow-float transition-all p-10 text-center">
            <div className="text-6xl mb-4 opacity-60">--</div>
            <h3 className="text-xl font-bold text-ink-main mb-2">未找到匹配内容</h3>
            <p className="text-sm text-ink-sub">换个关键词再试试？可以用更短的词</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!loading && items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-16 text-center pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-ink-sub hover:text-amber-700 font-mono transition-colors">
          返回首页
        </Link>
      </div>
    </div>
  );
}
