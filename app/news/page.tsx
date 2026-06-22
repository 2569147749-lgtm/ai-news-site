import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { getNewsWithFallback } from "@/lib/data";

export const revalidate = 600;

export const metadata = {
  title: "全部资讯 · Aura Daily",
  description: "按时间浏览全部 AI 资讯，支持按分类、来源和标签筛选。",
};

export default async function NewsPage() {
  const items = await getNewsWithFallback();
  const categories = Array.from(new Set(items.map((i) => i.category))).sort();
  const sources = Array.from(new Set(items.map((i) => i.source))).sort();

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-sand-grid opacity-60 pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-14">
        <div className="mb-12 text-center">
          <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-3">// NEWS FEED</div>
          <h1 className="text-4xl md:text-5xl font-black text-ink-main mb-4 tracking-tight">
            全部<span className="text-gradient-brand">资讯</span>
          </h1>
          <p className="text-ink-sub text-base max-w-xl mx-auto">
            共 <span className="text-amber-700 font-bold">{items.length}</span> 条资讯 · 按时间倒序排列 · 持续更新
          </p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent mb-10"></div>

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {(() => {
            const categoryCount = items.reduce<Record<string, number>>((acc, i) => {
              acc[i.category] = (acc[i.category] || 0) + 1;
              return acc;
            }, {});
            return categories.map((c, i) => (
              <Link key={c} href={`/search?q=${encodeURIComponent(c)}`} className={`${i % 3 === 0 ? "chip-amber" : i % 3 === 1 ? "chip-aqua" : "chip-coral"} hover:scale-105 transition-transform`}>
                {c} · {categoryCount[c]}
              </Link>
            ));
          })()}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent mt-20 mb-10"></div>

        <div className="bg-sand-card border-sand-edge rounded-2xl shadow-card overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-sand-edge bg-sand-soft/40">
            <span className="w-2.5 h-2.5 rounded-full bg-coral/60"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span className="ml-2 text-terminal-sm font-mono text-ink-sub">~/sources.json</span>
          </div>
          <div className="p-6">
            <h2 className="text-lg font-bold text-ink-main mb-1">📡 信息来源</h2>
            <p className="text-xs text-ink-sub font-mono mb-5">// trusted rss feeds · {sources.length} sources</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {sources.map((s, i) => (
                <div
                  key={s}
                  className="text-xs font-mono text-ink-main bg-sand-bg border border-sand-edge px-3 py-2.5 rounded-lg text-center hover:border-amber-300 hover:shadow-card transition-colors"
                >
                  <span className="text-aqua mr-1">#{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
