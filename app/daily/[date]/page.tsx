import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsWithFallback } from "@/lib/data";
import { getShanghaiDate, isValidDate } from "@/lib/news-date";
import NewsCard from "@/components/NewsCard";

interface Props {
  params: { date: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 600;

export async function generateMetadata({ params }: Props) {
  return {
    title: `${params.date} · 每日早报`,
    description: `${params.date} 当日 AI 领域动态汇总。`,
  };
}

export default async function DailyDetail({ params }: Props) {
  const items = await getNewsWithFallback();
  const dayItems = items.filter(
    (i) =>
      isValidDate(i.publishedAt) &&
      getShanghaiDate(i.publishedAt) === params.date
  );

  if (dayItems.length === 0) {
    notFound();
  }

  const byCategory: Record<string, typeof items> = {};
  for (const item of dayItems) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }

  const sortedCategories = Object.keys(byCategory).sort(
    (a, b) => byCategory[b].length - byCategory[a].length
  );

  const allTags = new Set<string>();
  dayItems.forEach((i) => i.tags.forEach((t) => allTags.add(t)));

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-sand-grid opacity-50 pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-14">
        <Link
          href="/daily"
          className="text-sm text-ink-sub hover:text-amber-700 transition-colors inline-flex items-center gap-1 mb-8 font-mono"
        >
          ← 返回早报归档
        </Link>

        {/* 顶部标题卡片 */}
        <div className="terminal-card mb-10 overflow-hidden">
          <div className="terminal-card-top">
            <span style={{ background: "#f59e0b" }}></span>
            <span style={{ background: "#06b6d4" }}></span>
            <span style={{ background: "#ef4444" }}></span>
            <span className="ml-2 text-terminal-sm font-mono text-ink-sub">DAILY_REPORT/{params.date}.md</span>
          </div>
          <div className="p-8 md:p-12 bg-gradient-to-br from-amber-50 via-sand-card to-cyan-50/60 border-t border-sand-edge">
            <div className="text-xs text-aqua font-mono mb-3 tracking-widest">
              // AI · DAILY · REPORT
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-ink-main mb-4 tracking-tight">
              {params.date}
            </h1>
            <p className="text-ink-sub text-base md:text-lg leading-relaxed">
              当日共聚合 <span className="text-amber-700 font-bold">{dayItems.length}</span> 条 AI 资讯 ·
              覆盖 <span className="text-aqua font-bold">{sortedCategories.length}</span> 个分类
            </p>

            {allTags.size > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {Array.from(allTags).slice(0, 10).map((t, i) => (
                  <span key={t} className={i % 3 === 0 ? "chip-amber" : i % 3 === 1 ? "chip-aqua" : "chip-coral"}>
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* 统计条 */}
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="px-4 py-3 rounded-xl bg-sand-card border border-sand-edge min-w-[120px]">
                <div className="text-xs font-mono text-ink-sub">TOTAL</div>
                <div className="text-xl font-black text-amber-700">{dayItems.length}</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-sand-card border border-sand-edge min-w-[120px]">
                <div className="text-xs font-mono text-ink-sub">CATEGORIES</div>
                <div className="text-xl font-black text-aqua">{sortedCategories.length}</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-sand-card border border-sand-edge min-w-[120px]">
                <div className="text-xs font-mono text-ink-sub">TAGS</div>
                <div className="text-xl font-black text-red-700">{allTags.size}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 分类区块 */}
        <div className="space-y-12">
          {sortedCategories.map((cat, idx) => (
            <section key={cat}>
              <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-sand-edge">
                <h2 className="text-xl md:text-2xl font-black text-ink-main flex items-center gap-3">
                  <span className="font-mono text-xs text-amber-700">{String(idx + 1).padStart(2, "0")}</span>
                  <span>{cat}</span>
                </h2>
                <span className="chip-aqua">
                  {byCategory[cat].length} 条
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {byCategory[cat].map((item) => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
