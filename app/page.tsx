import NewsCard from "@/components/NewsCard";
import NewsFeed from "@/components/NewsFeed";
import { getNewsWithFallback } from "@/lib/data";
import { getShanghaiDate } from "@/lib/news-date";
import { getNewsPage } from "@/lib/news-pagination";

export const dynamic = "force-dynamic";
export const revalidate = 600;

export const metadata = {
  title: "AI 日报 · 中文 AI 资讯",
  description: "聚合中文 AI 产品、行业与应用资讯。",
};

interface HomePageProps {
  searchParams?: { page?: string };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const items = await getNewsWithFallback();
  const today = getShanghaiDate(new Date());
  const requestedPage = Number(searchParams?.page || "1");
  const visibleBatches = Number.isFinite(requestedPage)
    ? Math.max(1, Math.floor(requestedPage))
    : 1;
  const featuredItems = items.slice(0, 3);
  const updates = getNewsPage(items.slice(3), 1, visibleBatches * 20);

  return (
    <div className="site-shell py-7 md:py-10">
      <div className="mb-7 flex flex-col justify-between gap-4 border-b border-sand-edge pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="section-kicker">AI BRIEFING · {today}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-main md:text-3xl">
            最新 AI 资讯
          </h1>
        </div>
        <form action="/search" method="get" className="flex w-full max-w-sm gap-2">
          <input
            name="q"
            type="search"
            aria-label="搜索资讯"
            autoComplete="off"
            placeholder="搜索模型、产品或公司"
            className="min-w-0 flex-1 rounded-md border border-sand-edge px-3 py-2 text-sm outline-none transition-colors focus:border-amber"
          />
          <button type="submit" className="btn-primary">
            搜索
          </button>
        </form>
      </div>

      <div className="mx-auto max-w-3xl">
        {items.length === 0 ? (
          <div className="border-y border-sand-edge py-12 text-center text-sm text-ink-sub">
            资讯正在同步，请稍后刷新。
          </div>
        ) : (
          <>
            {featuredItems.length > 0 && (
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="section-title">今日重点</h2>
                  <span className="text-xs text-ink-dim">{items.length} 条更新</span>
                </div>
                <div>
                  {featuredItems.map((item) => (
                    <NewsCard key={item.id} item={item} featured />
                  ))}
                </div>
              </section>
            )}

            <section className={featuredItems.length > 0 ? "mt-9" : ""}>
              <NewsFeed
                initialItems={updates.items}
                initialPage={visibleBatches}
                initialHasMore={updates.hasMore}
                totalItems={items.slice(3).length}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}
