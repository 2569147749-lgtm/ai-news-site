import Link from "next/link";

export const metadata = {
  title: "404 找不到页面 · Aura Daily",
  description: "抱歉，该页面不存在或链接已失效。",
};

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] bg-sand-grid">
      <div className="relative max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-6">// ERROR · 404</div>

        <div className="text-[8rem] md:text-[12rem] font-black leading-none mb-6">
          <span className="text-gradient-brand">404</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-ink-main mb-4">
          抱歉，找不到这页内容
        </h1>
        <p className="text-ink-sub text-base mb-10">
          可能链接已失效，或者资讯还未被抓取 · <span className="text-amber-700 font-mono text-sm">NOT_FOUND</span>
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2">
            ← 回到首页
          </Link>
          <Link href="/news" className="btn-ghost focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2">
            浏览资讯
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4 text-xs font-mono text-ink-sub">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-dim to-transparent max-w-[100px]"></div>
          <span>AURA · DAILY</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-sand-dim to-transparent max-w-[100px]"></div>
        </div>
      </div>
    </div>
  );
}
