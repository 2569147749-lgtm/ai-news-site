import Link from "next/link";
import { getNewsWithFallback } from "@/lib/data";
import { getAllDates } from "@/lib/kv";
import NewsCard from "@/components/NewsCard";

export const revalidate = 600;

export const metadata = {
  title: "每日早报 · Aura Daily",
  description: "按日期查看 AI 行业每日动态与热门话题。",
};

export default async function DailyIndex() {
  const items = await getNewsWithFallback();
  const dates = getAllDates(items);

  return (
    <div className="relative bg-sand-grid">
      <div className="relative max-w-6xl mx-auto px-4 py-14">
        <div className="mb-12 text-center">
          <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-3">// DAILY BRIEFING</div>
          <h1 className="text-3xl md:text-5xl font-black text-ink-main mb-4 tracking-tight">
            每日<span className="text-gradient-brand">早报</span>
          </h1>
          <p className="text-ink-sub text-base">
            按日期浏览 AI 行业动态 · 共 <span className="font-bold text-amber-700">{dates.length}</span> 天记录
          </p>
        </div>

        {dates.length === 0 ? (
          <div className="bg-sand-card border border-sand-edge rounded-2xl shadow-card hover:border-amber-300 hover:shadow-float transition-all p-12 text-center">
            <div className="text-5xl mb-4 opacity-60">⚠</div>
            <h3 className="text-xl font-bold text-ink-main mb-2">暂无数据</h3>
            <p className="text-sm text-ink-sub font-mono">
              请先访问 <span className="text-aqua font-semibold">/api/crawl</span> 触发一次抓取
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {dates.map((date) => {
              const dayItems = items.filter(
                (i) => i.publishedAt.slice(0, 10) === date
              );

              return (
                <section key={date}>
                  <div className="h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent mb-5"></div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700">DATE</div>
                      <Link href={`/daily/${date}`} className="text-2xl md:text-3xl font-black text-ink-main hover:text-amber-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2">
                        {date}
                      </Link>
                    </div>
                    <div className="chip-amber">
                      {dayItems.length} 条
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayItems.slice(0, 6).map((item) => (
                      <NewsCard key={item.id} item={item} />
                    ))}
                  </div>

                  {dayItems.length > 6 && (
                    <div className="mt-5 text-center">
                      <Link
                        href={`/daily/${date}`}
                        className="btn-ghost !px-5 !py-2 !text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
                      >
                        查看 {date} 全部 {dayItems.length} 条 →
                      </Link>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
