import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import { getNewsWithFallback } from "@/lib/data";

export const revalidate = 600;

export const metadata = {
  title: "Aura Daily · AI 每日资讯",
  description: "自动聚合全球 AI 领域新闻、论文与产品动态，每日生成一份值得阅读的早报。",
};

export default async function HomePage() {
  const items = await getNewsWithFallback();
  const topItems = items.slice(0, 3);
  const listItems = items.slice(3, 9);

  const categories = Array.from(new Set(items.map((i) => i.category))).slice(0, 6);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden">
        {/* 背景网格 */}
        <div className="absolute inset-0 bg-sand-grid opacity-80 pointer-events-none"></div>

        {/* 柔和光晕 */}
        <div className="absolute -top-10 -left-10 w-[520px] h-[520px] rounded-full bg-amber-200/40 blur-[80px] pointer-events-none"></div>
        <div className="absolute top-10 -right-10 w-[480px] h-[480px] rounded-full bg-cyan-200/40 blur-[80px] pointer-events-none"></div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="flex flex-col items-center text-center">
            {/* LIVE 状态条 */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-300 bg-green-50 text-xs font-mono mb-8">
              <span className="pulse-dot"></span>
              <span className="text-green-700 tracking-wider">LIVE GRID</span>
              <span className="text-ink-sub">//</span>
              <span className="text-ink-sub">{today}</span>
              <span className="text-ink-sub">//</span>
              <span className="text-amber-700">每小时自动更新</span>
            </div>

            {/* 标题 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6 max-w-5xl">
              <span className="block text-ink-main">掌握全球 AI 脉搏</span>
              <span className="block mt-2 text-gradient-brand">每天 5 分钟，洞察未来</span>
            </h1>

            {/* 副标 */}
            <p className="text-base md:text-lg text-ink-sub max-w-2xl leading-relaxed mb-10">
              自动聚合 <span className="text-amber-700 font-semibold">OpenAI</span>、
              <span className="text-cyan-700 font-semibold">Anthropic</span>、
              机器之心、arXiv 等 10+ 资讯源，
              <span className="text-amber-700 font-semibold">智能分类</span>与标签，
              每天生成一份值得阅读的早报。
            </p>

            {/* CTA */}
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              <Link href={`/daily/${today}`} className="btn-neon">
                查看今日早报 →
              </Link>
              <Link href="/news" className="btn-ghost">
                浏览全部资讯
              </Link>
            </div>
            <form action="/search" method="get" className="flex gap-2 max-w-xl mx-auto mb-14">
              <input
                type="search"
                name="q"
                placeholder="试试搜索：GPT、Claude、多模态…"
                aria-label="搜索资讯"
                autoComplete="off"
                className="flex-1 px-4 py-2.5 bg-sand-card border border-sand-edge rounded-full text-ink-main placeholder:text-ink-dim focus:outline-none focus:border-amber-300 focus:shadow-card transition-all text-sm font-mono"
              />
              <button type="submit" className="btn-neon !py-2.5 !px-5 !text-xs whitespace-nowrap">
                搜索
              </button>
            </form>

            {/* 数据卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-3xl">
              {[
                { label: "SOURCES", value: "10+" },
                { label: "今日", value: items.length.toString() },
                { label: "TAGS", value: categories.length.toString() },
                { label: "UPDATED", value: "1H" },
              ].map((s, i) => (
                <div key={s.label} className="stat-card">
                  <div className="text-2xl md:text-3xl font-black text-gradient-brand">{s.value}</div>
                  <div className="text-terminal-xs md:text-xs text-ink-sub mt-1 font-mono uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* 分类标签 */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((c, i) => (
                <Link
                  key={c}
                  href={`/search?q=${encodeURIComponent(c)}`}
                  className={`${i % 3 === 0 ? "chip-amber" : i % 3 === 1 ? "chip-aqua" : "chip-coral"} hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== 分隔线 ========== */}
      <div aria-hidden className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent"></div>

      {/* ========== FEATURED ========== */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-3">
              // FEATURED TODAY
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-ink-main leading-tight">
              今日焦点 <span className="text-gradient-brand">精选资讯</span>
            </h2>
            <p className="text-sm text-ink-sub mt-3">从 10+ 资讯源中自动筛选的热门内容</p>
          </div>
          <Link href="/news" className="btn-ghost !py-2 !px-4 !text-xs">
            查看全部 →
          </Link>
        </div>

        <div className="space-y-4">
          {topItems.map((item) => (
            <NewsCard key={item.id} item={item} featured />
          ))}
        </div>
      </section>

      {/* ========== 分隔线 ========== */}
      <div aria-hidden className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent"></div>

      {/* ========== LATEST GRID ========== */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.2em] text-cyan-700 mb-3">
              // LATEST FEED
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-ink-main leading-tight">
              最新<span className="text-gradient-brand">动态</span>
            </h2>
            <p className="text-sm text-ink-sub mt-3">实时聚合 · 自动标签 · 持续更新</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listItems.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}