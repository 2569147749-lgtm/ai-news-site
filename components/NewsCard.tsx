"use client";

import Link from "next/link";
import { NewsItem } from "@/lib/types";
import type { NewsCardProps } from "@/lib/types";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}天前`;
  return d.toISOString().slice(0, 10);
}

function tagColor(tag: string): string {
  const lower = tag.toLowerCase();
  if (lower.includes("模型") || lower.includes("llm") || lower.includes("gpt")) return "chip-amber";
  if (lower.includes("多模态") || lower.includes("图像") || lower.includes("视频")) return "chip-aqua";
  if (lower.includes("产品") || lower.includes("发布")) return "chip-amber";
  if (lower.includes("论文") || lower.includes("研究")) return "chip-aqua";
  if (lower.includes("开源")) return "chip-coral";
  return "chip-muted";
}

function categoryColor(cat: string): string {
  const lower = cat.toLowerCase();
  if (lower.includes("产品") || lower.includes("发布")) return "chip-amber";
  if (lower.includes("论文") || lower.includes("研究")) return "chip-aqua";
  if (lower.includes("行业") || lower.includes("动态")) return "chip-amber";
  if (lower.includes("开源")) return "chip-coral";
  return "chip-muted";
}

export default function NewsCard({ item, featured = false }: NewsCardProps) {
  return (
    <Link
      href={`/news/${item.id}`}
      className={`neon-card glass-card-hover group block p-5 md:p-6 relative overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${featured ? "md:p-7" : ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-amber-400 via-amber-500 to-cyan-500"
      />

      <div className="flex items-center gap-2 flex-wrap mb-4 pl-3">
        <span className="chip-muted">{item.source}</span>
        <span className={categoryColor(item.category)}>{item.category}</span>
        <span className="ml-auto font-mono text-terminal-xs text-ink-sub tracking-wider" suppressHydrationWarning>
          {typeof window !== "undefined" ? formatDate(item.publishedAt) : new Date(item.publishedAt).toISOString().slice(0, 10)}
        </span>
      </div>

      <h3 className="pl-3 font-bold leading-snug mb-3 line-clamp-2 text-sm md:text-base text-ink-main group-hover:text-amber-700 transition-colors">
        {item.title}
      </h3>

      {item.summary && (
        <p className="pl-3 text-sm text-ink-sub leading-relaxed line-clamp-3">
          {item.summary}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 pl-3">
          {item.tags.slice(0, 3).map((t) => (
            <span key={t} className={tagColor(t)}>
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 pt-4 border-t border-sand-edge flex items-center justify-end pl-3">
        <span className="flex items-center gap-1.5 text-terminal-sm font-mono text-ink-sub group-hover:text-amber-700 group-hover:translate-x-1 transition-colors">
          <span>查看详情</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
