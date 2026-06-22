import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata = {
  title: "站内搜索 · Aura Daily",
  description: "在 Aura Daily 站内搜索 AI 相关的新闻、论文、产品动态等内容。",
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-[3px] border-amber-300/40 border-t-amber-700 rounded-full animate-spin mb-4"></div>
        <div className="text-aqua font-mono text-sm">SEARCHING…</div>
      </div>
    }>
      <SearchClient />
    </Suspense>
  );
}
