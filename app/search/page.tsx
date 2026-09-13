import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "搜索资讯 · AI 日报",
  description: "搜索中文 AI 产品、行业与应用资讯。",
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
