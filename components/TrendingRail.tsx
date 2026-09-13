"use client";

import Link from "next/link";
import { useState } from "react";
import { buildMediaProxyUrl } from "@/lib/media-url";
import { getFirstArticleImage } from "@/lib/news-media";
import type { NewsItem } from "@/lib/types";

interface TrendingRailProps {
  items: NewsItem[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function TrendingRail({ items }: TrendingRailProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const activeItem = items[activeIndex];
  const coverUrl = getFirstArticleImage(activeItem.content);
  const coverImage = coverUrl
    ? buildMediaProxyUrl(coverUrl, activeItem.link) || coverUrl
    : "";

  const showItem = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section className="trending-carousel" aria-labelledby="trending-heading">
      <div className="trending-rail-header">
        <div>
          <p className="section-kicker">TRENDING NOW</p>
          <h2 id="trending-heading" className="section-title mt-1">
            热门速览
          </h2>
        </div>
        <div className="trending-rail-controls">
          <button
            type="button"
            className="trending-rail-button trending-rail-button-prev"
            aria-label="查看上一条热门资讯"
            onClick={() => showItem(-1)}
          />
          <button
            type="button"
            className="trending-rail-button trending-rail-button-next"
            aria-label="查看下一条热门资讯"
            onClick={() => showItem(1)}
          />
        </div>
      </div>

      <div className="trending-carousel-stage">
        <Link
          href={`/news/${activeItem.id}`}
          className={`trending-carousel-slide ${coverImage ? "has-cover" : ""}`}
          aria-label={`阅读热门资讯：${activeItem.title}`}
          style={
            coverImage
              ? { backgroundImage: `url("${coverImage}")` }
              : undefined
          }
        >
          <div className="trending-carousel-overlay" />
          <div className="trending-carousel-content">
            <div className="trending-rail-card-top">
              <span className="trending-carousel-label">热门速览</span>
              <span className="source-pill">{activeItem.source}</span>
            </div>
            <h3>{activeItem.title}</h3>
            {activeItem.summary && <p>{activeItem.summary}</p>}
            <div className="trending-carousel-footer">
              <time>{formatDate(activeItem.publishedAt)}</time>
              <span aria-live="polite">
                {activeIndex + 1} / {items.length}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
