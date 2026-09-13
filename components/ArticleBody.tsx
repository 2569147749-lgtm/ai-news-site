"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { enrichArticleMarkdown } from "@/lib/article-format";
import { getArticleOutline } from "@/lib/article-outline";
import { buildMediaProxyUrl } from "@/lib/media-url";

interface Props {
  content: string;
  link: string;
  source: string;
}

function getImageDimensions(title?: string | null) {
  const match = title?.match(/^image;w=(\d+);h=(\d+)$/);
  if (!match) return undefined;

  const width = Number(match[1]);
  const height = Number(match[2]);
  return width || height ? { width: width || undefined, height: height || undefined } : undefined;
}

function ArticleImage({
  src,
  alt,
  width,
  height,
  eager,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  eager: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="article-media-error">
        图片无法加载，请查看原文。
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}

export default function ArticleBody({ content, link, source }: Props) {
  const isFullArticle = Boolean(content && content.length > 500);
  const markdown = enrichArticleMarkdown(content);
  const mediaUrl = (src: string) => buildMediaProxyUrl(src, link) || src;
  const outline = getArticleOutline(markdown).filter((item) => item.depth > 1);
  const headingCounts = new Map<string, number>();
  let imageIndex = 0;

  const getHeadingId = (children: React.ReactNode) => {
    const text = String(children).trim();
    const count = (headingCounts.get(text) || 0) + 1;
    headingCounts.set(text, count);
    return count === 1 ? text : `${text}-${count}`;
  };

  return (
    <div className="article-reading">
      {outline.length >= 3 && (
        <aside className="article-toc" aria-label="文章目录">
          <p className="section-kicker">目录</p>
          <nav>
            {outline.map((item) => (
              <a
                key={item.id}
                href={`#${encodeURIComponent(item.id)}`}
                style={{ paddingLeft: `${(item.depth - 2) * 10}px` }}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </aside>
      )}

      {markdown ? (
        <div className="article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1({ children }) {
                return <h1 id={getHeadingId(children)}>{children}</h1>;
              },
              h2({ children }) {
                return <h2 id={getHeadingId(children)}>{children}</h2>;
              },
              h3({ children }) {
                return <h3 id={getHeadingId(children)}>{children}</h3>;
              },
              img({ src, alt, title }) {
                if (!src) return null;

                if (title === "video") {
                  return (
                    <figure className="article-media article-video">
                      <video controls playsInline preload="metadata">
                        <source src={mediaUrl(src)} />
                        当前浏览器不支持播放此视频。
                      </video>
                      <figcaption>{alt || "视频"}</figcaption>
                    </figure>
                  );
                }

                if (title === "audio") {
                  return (
                    <figure className="article-media article-audio">
                      <audio controls preload="none" src={mediaUrl(src)}>
                        当前浏览器不支持播放此音频。
                      </audio>
                      <figcaption>{alt || "音频"}</figcaption>
                    </figure>
                  );
                }

                const dimensions = getImageDimensions(title);
                const eager = imageIndex === 0;
                imageIndex += 1;
                return (
                  <figure className="article-media">
                    <ArticleImage
                      src={mediaUrl(src)}
                      alt={alt || ""}
                      width={dimensions?.width}
                      height={dimensions?.height}
                      eager={eager}
                    />
                  </figure>
                );
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-sm leading-7 text-ink-sub">
          暂无可展示的正文，请前往原文阅读。
        </p>
      )}

      {!isFullArticle && link && (
        <div className="mt-8 text-sm text-ink-sub">
          当前仅提供 {source} 的摘要，完整内容请查看原文。
        </div>
      )}

      <button
        type="button"
        className="article-back-to-top"
        aria-label="回到顶部"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </div>
  );
}
