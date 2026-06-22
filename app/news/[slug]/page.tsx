import Link from "next/link";
import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import ArticleBody from "@/components/ArticleBody";
import { getNewsWithFallback } from "@/lib/data";
import { getNewsBySlug } from "@/lib/kv";

interface Props {
  params: { slug: string };
}

export const revalidate = 600;

export async function generateMetadata({ params }: Props) {
  const items = await getNewsWithFallback();
  const item =
    (await getNewsBySlug(params.slug)) ||
    items.find((i) => i.id === params.slug);

  if (!item) {
    return { title: "未找到 · Aura Daily" };
  }

  return {
    title: `${item.title} · Aura Daily`,
    description: item.summary,
    keywords: item.tags,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const items = await getNewsWithFallback();
  const item =
    (await getNewsBySlug(params.slug)) ||
    items.find((i) => i.id === params.slug);

  if (!item) {
    notFound();
  }

  const relatedItems = items
    .filter(
      (i) =>
        i.id !== item.id &&
        (i.category === item.category || i.tags.some((t) => item.tags.includes(t)))
    )
    .slice(0, 4);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-sand-grid opacity-50 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 py-14">
        <Link
          href="/news"
          className="text-sm text-ink-sub hover:text-amber-700 transition-colors inline-flex items-center gap-1 mb-8 font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          ← 返回全部资讯
        </Link>

        <article>
          {/* 标签条 */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="chip-muted">{item.source}</span>
            <span className="chip-amber">{item.category}</span>
            <time className="ml-auto text-xs font-mono text-ink-sub">
              {new Date(item.publishedAt).toISOString().replace("T", " · ").slice(0, 19)} UTC
            </time>
          </div>

          {/* 标题 */}
          <h1 className="text-xl md:text-3xl font-semibold text-ink-main leading-tight mb-6 tracking-wide" style={{ textWrap: "balance" }}>
            {item.title}
          </h1>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mb-10 flex flex-wrap gap-2">
              {item.tags.map((t, i) => (
                <span key={t} className={i % 3 === 0 ? "chip-amber" : i % 3 === 1 ? "chip-aqua" : "chip-coral"}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* 正文：有 content 直接显示；没有就自动从原文 URL 实时提取 */}
          <ArticleBody
            summary={item.summary}
            content={item.content}
            link={item.link}
            source={item.source}
          />

          {/* 原文 CTA */}
          <div className="neon-card p-8 mb-10">
            <h2 className="text-lg font-bold text-ink-main mb-3 flex items-center gap-2">
              <span>📄</span> 查看原文
            </h2>
            <p className="text-sm text-ink-sub mb-5">
              完整内容由 <span className="text-amber-700 font-semibold">{item.source}</span> 发布，
              点击下方按钮访问原文。
            </p>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-neon !px-6 !py-3 inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
            >
              打开原文 ↗
            </a>
            <div className="mt-4 text-xs font-mono text-ink-sub break-all">
              → {item.link}
            </div>
          </div>
        </article>

        {/* 相关资讯 */}
        {relatedItems.length > 0 && (
          <section className="mt-16">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-5">
              // RELATED · FEED
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-ink-main mb-6 tracking-wide">
              相关<span className="text-gradient-brand">资讯</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedItems.map((r) => (
                <NewsCard key={r.id} item={r} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
