"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

interface Props {
  summary: string;
  content: string | undefined;
  link: string;
  source: string;
  showFullArticleFallback?: boolean;
}

const FETCH_TIMEOUT_MS = 8000;

export default function ArticleBody({
  summary,
  content,
  link,
  source,
  showFullArticleFallback = false,
}: Props) {
  const [markdown, setMarkdown] = useState<string | undefined>(content);
  const [loading, setLoading] = useState<boolean>(!content && !!link);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number>(
    Math.ceil(FETCH_TIMEOUT_MS / 1000)
  );

  useEffect(() => {
    if (content || !link) return;

    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    // countdown for UI
    const startTs = Date.now();
    const tickTimer = setInterval(() => {
      const left = Math.max(
        0,
        Math.ceil((FETCH_TIMEOUT_MS - (Date.now() - startTs)) / 1000)
      );
      setRemaining(left);
    }, 500);

    async function load() {
      try {
        const res = await fetch(
          `/api/full-article?url=${encodeURIComponent(link)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && data?.content) {
          setMarkdown(data.content);
        } else if (!cancelled) {
          setError("该来源暂无法自动提取，请点击下方按钮查看原文");
        }
      } catch (err) {
        if (!cancelled) {
          if (
            err instanceof Error &&
            (err.name === "AbortError" ||
              err.message.toLowerCase().includes("aborted"))
          ) {
            setError("加载超时，可能是源站响应慢，请点击下方按钮查看原文");
          } else {
            setError("该来源暂无法自动提取，请点击下方按钮查看原文");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearInterval(tickTimer);
      controller.abort();
    };
  }, [content, link]);

  return (
    <div className="terminal-card mb-8">
      <div className="terminal-card-top">
        <span style={{ background: "#f59e0b" }}></span>
        <span style={{ background: "#06b6d4" }}></span>
        <span style={{ background: "#ef4444" }}></span>
        <span className="ml-2 text-terminal-sm font-mono text-ink-sub">
          ~/article.txt
        </span>
      </div>
      <div className="p-8 md:p-10">
        {summary && (
          <div className="mb-8">
            <div className="text-xs font-mono text-aqua mb-3">
              // CONTENT · PREVIEW
            </div>
            <p className="text-lg md:text-xl text-ink-main leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        <div>
          <div className="text-xs font-mono text-aqua mb-3">
            // ARTICLE · BODY
          </div>

          {markdown ? (
            <div className="article-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          ) : loading ? (
            <div className="py-6 text-ink-sub">
              <div className="font-mono text-terminal-sm mb-3">
                正在从 {source} 提取完整内容… 预计还需 {remaining} 秒
              </div>
              <div className="w-full h-1.5 bg-sand-grid opacity-40 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.round(
                        (1 - remaining / Math.ceil(FETCH_TIMEOUT_MS / 1000)) * 100
                      )
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-sand-grid opacity-60 rounded w-full"></div>
                <div className="h-3 bg-sand-grid opacity-50 rounded w-11/12"></div>
                <div className="h-3 bg-sand-grid opacity-40 rounded w-10/12"></div>
                <div className="h-3 bg-sand-grid opacity-50 rounded w-full"></div>
                <div className="h-3 bg-sand-grid opacity-60 rounded w-9/12"></div>
              </div>
            </div>
          ) : error ? (
            <div className="py-4">
              <p className="text-base md:text-lg text-ink-sub leading-relaxed mb-4">
                {error}
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon !px-5 !py-2.5 text-sm inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                打开原文 ↗
              </a>
            </div>
          ) : showFullArticleFallback ? (
            <div className="py-4">
              <p className="text-base md:text-lg text-ink-sub leading-relaxed mb-4">
                无法提取完整文章，您可以点击下方按钮查看原文。
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon !px-5 !py-2.5 text-sm inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                打开原文 ↗
              </a>
            </div>
          ) : (
            <div className="py-4">
              <p className="text-base md:text-lg text-ink-sub leading-relaxed mb-4">
                该来源仅提供摘要，您可以点击下方按钮查看原文获取完整内容。
              </p>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon !px-5 !py-2.5 text-sm inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
              >
                打开原文 ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
