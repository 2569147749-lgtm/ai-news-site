import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import NewsCard from "@/components/NewsCard";
import ArticleBody from "@/components/ArticleBody";
import { extractArticle } from "@/lib/article-extractor";
import {
  getArticleAttribution,
  stripArticleBoilerplate,
} from "@/lib/article-format";
import { getNewsItemById, getNewsWithFallback } from "@/lib/data";
import { getShanghaiDate } from "@/lib/news-date";
import { cleanNewsSummary } from "@/lib/news-summary";

interface Props {
  params: { slug: string };
}

export const dynamic = "force-dynamic";
export const revalidate = 600;

/* ========== 全文提取（独立的 Server Component，可以被 Suspense 包裹） ========== */
interface FullContentCache {
  content: string;
  cachedAt: number;
}
const fullContentCache = new Map<string, FullContentCache>();
const FULL_CONTENT_TTL = 1000 * 60 * 60 * 24; // 24 小时

function hasStructuredContent(content: string) {
  return /(^#{1,4}\s|!\[[^\]]*]\(|^>\s|^-\s)/m.test(content);
}

async function FullArticleBody({
  link,
  source,
  existingContent,
  summary,
}: {
  link?: string;
  summary?: string;
  source: string;
  existingContent?: string;
}) {
  const safeLink = link || "";
  const safeSummary = summary || "";
  const safeExisting = existingContent || "";

  // 1) 如果 RSS 已经提供了足够长的正文 → 直接用
  if (
    safeExisting &&
    safeExisting.length > 500 &&
    hasStructuredContent(safeExisting)
  ) {
    return (
      <ArticleBody
        content={stripArticleBoilerplate(safeExisting)}
        link={safeLink}
        source={source}
      />
    );
  }

  // 2) 内存缓存？
  if (safeLink) {
    const cached = fullContentCache.get(safeLink);
    const now = Date.now();
    if (cached && now - cached.cachedAt < FULL_CONTENT_TTL) {
      return (
        <ArticleBody
          content={stripArticleBoilerplate(cached.content)}
          link={safeLink}
          source={source}
        />
      );
    }
  }

  // 3) 调 Jina Reader（最多 8 秒，失败回退 summary）
  let finalContent: string = safeExisting || safeSummary || "";
  if (safeLink) {
    try {
      const extracted = await Promise.race([
        extractArticle(safeLink),
        new Promise<null>((_, rej) => setTimeout(() => rej("timeout"), 8000)),
      ]);
      if (extracted && extracted.content && extracted.content.length > 200) {
        fullContentCache.set(safeLink, {
          content: extracted.content,
          cachedAt: Date.now(),
        });
        finalContent = extracted.content;
      }
    } catch {
      // 超时或失败 → 继续使用 summary
    }
  }

  return (
    <ArticleBody
      content={stripArticleBoilerplate(
        finalContent || safeSummary || "暂无全文内容，请点击下方链接查看原文。"
      )}
      link={safeLink}
      source={source}
    />
  );
}

/* ========== 相关文章（也包在 Suspense 里） ========== */
async function RelatedArticles({ itemId, category, tags }: { itemId: string; category: string; tags: string[] }) {
  const items = await getNewsWithFallback();
  const relatedItems = items
    .filter(
      (i) =>
        i.id !== itemId &&
        (i.category === category || i.tags.some((t) => tags.includes(t)))
    )
    .slice(0, 4);

  if (relatedItems.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="section-title mb-3 border-b border-sand-edge pb-3">相关资讯</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {relatedItems.map((r) => (
          <NewsCard key={r.id} item={r} />
        ))}
      </div>
    </section>
  );
}

/* ========== 全文正文的加载骨架 ========== */
function ArticleLoading() {
  return (
    <div className="mb-8 py-6">
      <div className="space-y-4 animate-pulse">
        <div className="h-4 w-full rounded bg-sand-soft" />
        <div className="h-4 w-[94%] rounded bg-sand-soft" />
        <div className="h-4 w-[80%] rounded bg-sand-soft" />
      </div>
    </div>
  );
}

/* ========== Metadata ========== */
export async function generateMetadata({ params }: Props) {
  const item = await getNewsItemById(params.slug);
  if (!item) return { title: "未找到 · Aura Daily" };
  return {
    title: `${cleanNewsSummary(item.title)} · Aura Daily`,
    description: cleanNewsSummary(item.summary),
    keywords: item.tags,
  };
}

/* ========== 主页面：先渲染文章元数据，正文和相关文章异步加载 ========== */
export default async function NewsDetailPage({ params }: Props) {
  const item = await getNewsItemById(params.slug);
  if (!item) notFound();
  const title = cleanNewsSummary(item.title);
  const attribution = getArticleAttribution(
    `${item.content || ""}\n${item.summary || ""}`,
    item.source
  );

  return (
    <div className="site-shell max-w-4xl py-8 md:py-12">
        <Link
          href="/"
          className="mb-7 inline-flex text-sm text-ink-sub hover:text-ink-main"
        >
          返回首页
        </Link>

        <article>
          {/* 标题 — 立刻渲染 */}
          <h1
            className="article-title mb-3 text-2xl font-extrabold leading-tight text-ink-main md:text-4xl"
          >
            {title}
          </h1>

          <p className="article-attribution mb-10">
            {attribution.publication && <span>{attribution.publication}</span>}
            {attribution.author && <span> · {attribution.author}</span>}
            <span> · {getShanghaiDate(item.publishedAt)}</span>
          </p>

          {/* 🔑 正文全文 — 通过 Suspense 异步加载（不阻塞首屏） */}
          <Suspense fallback={<ArticleLoading />}>
            <FullArticleBody
              link={item.link}
              summary={item.summary}
              source={item.source}
              existingContent={item.content}
            />
          </Suspense>

          {/* 原文链接 — 立刻渲染 */}
          {item.link && (
            <div className="mt-12 text-center">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                查看原文 ↗
              </a>
            </div>
          )}
        </article>

        {/* 🔑 相关文章 — 也包在 Suspense 里，不和首屏争抢时间 */}
        <Suspense
          fallback={
            <section className="mt-16">
              <div className="h-4 w-32 bg-sand-edge/40 rounded mb-5" />
              <div className="h-7 w-32 bg-sand-edge/30 rounded mb-6" />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-32 bg-sand-edge/20 rounded-xl animate-pulse-slow" />
                <div className="h-32 bg-sand-edge/20 rounded-xl animate-pulse-slow" />
              </div>
            </section>
          }
        >
          <RelatedArticles
            itemId={item.id}
            category={item.category}
            tags={item.tags}
          />
        </Suspense>
    </div>
  );
}
