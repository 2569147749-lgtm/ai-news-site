"use client";

import Link from "next/link";
import { useRef } from "react";
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
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: -1 | 1) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(railRef.current.clientWidth * 0.82, 460),
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="trending-rail" aria-labelledby="trending-heading">
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
            onClick={() => scrollByCard(-1)}
          />
          <button
            type="button"
            className="trending-rail-button trending-rail-button-next"
            aria-label="查看下一条热门资讯"
            onClick={() => scrollByCard(1)}
          />
        </div>
      </div>

      <div ref={railRef} className="trending-rail-track">
        {items.map((item, index) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="trending-rail-card"
            aria-label={`阅读热门资讯：${item.title}`}
          >
            <div className="trending-rail-card-top">
              <span className="trending-rail-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="source-pill">{item.source}</span>
            </div>
            <h3>{item.title}</h3>
            {item.summary && <p>{item.summary}</p>}
            <time>{formatDate(item.publishedAt)}</time>
          </Link>
        ))}
      </div>
    </section>
  );
}
