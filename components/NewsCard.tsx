"use client";

import Link from "next/link";
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
  return (
    <Link
      href={`/news/${item.id}`}
      className={`feed-card ${featured ? "feed-card-featured" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="source-pill">{item.source}</span>
        <span className="text-ink-dim">{item.category}</span>
        <time className="ml-auto tabular-nums text-ink-dim">
          {formatDate(item.publishedAt)}
        </time>
      </div>

      <h3 className="feed-card-title mt-3">{item.title}</h3>

      {item.summary && <p className="feed-card-summary">{item.summary}</p>}

      {showTags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="topic-pill">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
