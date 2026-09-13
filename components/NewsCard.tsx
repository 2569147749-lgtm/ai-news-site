"use client";

import Link from "next/link";
import { buildMediaProxyUrl } from "@/lib/media-url";
import { getFirstArticleImage } from "@/lib/news-media";
import { cleanNewsSummary } from "@/lib/news-summary";
import type { NewsCardProps } from "@/lib/types";

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function NewsCard({
  item,
  featured = false,
  showTags = false,
}: NewsCardProps) {
  const coverUrl = getFirstArticleImage(item.content);
  const coverImage = coverUrl
    ? buildMediaProxyUrl(coverUrl, item.link) || coverUrl
    : "";
  const title = cleanNewsSummary(item.title);
  const summary = cleanNewsSummary(item.summary);

  return (
    <Link
      href={`/news/${item.id}`}
      className={`feed-card ${featured ? "feed-card-featured" : ""} ${
        coverImage ? "feed-card-with-image" : "feed-card-text-only"
      } ${!summary ? "feed-card-no-summary" : ""}`}
    >
      <div className="feed-card-copy">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="source-pill">{item.source}</span>
        </div>

        <h3 className="feed-card-title">{title}</h3>

        {summary && <p className="feed-card-summary">{summary}</p>}

        {showTags && item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="topic-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="feed-card-meta">
          <span>{item.category}</span>
          <time>{formatDate(item.publishedAt)}</time>
          <span className="feed-card-arrow" aria-hidden="true">
            →
          </span>
        </div>
      </div>

      {coverImage && (
        <div className="feed-card-thumb">
          <img src={coverImage} alt="" loading="lazy" />
        </div>
      )}
    </Link>
  );
}
