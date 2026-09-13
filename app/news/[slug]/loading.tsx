export default function NewsDetailLoading() {
  return (
    <div className="relative max-w-4xl mx-auto px-4 py-14">
      {/* 返回链接骨架 */}
      <div className="h-4 w-32 bg-sand-edge/40 rounded mb-10" />

      {/* 标签骨架 */}
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-sand-edge/40 rounded-full" />
        <div className="h-6 w-20 bg-sand-edge/40 rounded-full" />
      </div>

      {/* 标题骨架 */}
      <div className="h-8 w-5/6 bg-sand-edge/40 rounded mb-3" />
      <div className="h-8 w-2/3 bg-sand-edge/40 rounded mb-10" />

      {/* 时间骨架 */}
      <div className="h-3 w-48 bg-sand-edge/30 rounded mb-10" />

      {/* 摘要骨架 */}
      <div className="mb-10 p-5 bg-amber-50/50 border-l-4 border-amber-200 rounded-r-xl space-y-3">
        <div className="h-4 w-full bg-sand-edge/30 rounded" />
        <div className="h-4 w-5/6 bg-sand-edge/30 rounded" />
        <div className="h-4 w-4/6 bg-sand-edge/30 rounded" />
      </div>

      {/* 正文骨架 */}
      <div className="terminal-card p-6 md:p-8 mb-10">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-sand-edge/60">
          <div className="w-3 h-3 rounded-full bg-red-300/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-300/60" />
          <div className="w-3 h-3 rounded-full bg-green-300/60" />
          <span className="ml-3 text-xs font-mono text-ink-dim">
            ~ / article.txt · 正在提取全文
          </span>
        </div>
        <div className="space-y-4 animate-pulse-slow">
          <div className="h-4 w-full bg-sand-edge/30 rounded" />
          <div className="h-4 w-[95%] bg-sand-edge/30 rounded" />
          <div className="h-4 w-[85%] bg-sand-edge/30 rounded" />
          <div className="h-4 w-[92%] bg-sand-edge/30 rounded" />
          <div className="h-4 w-[88%] bg-sand-edge/30 rounded" />
          <div className="h-4 w-[78%] bg-sand-edge/30 rounded" />
          <div className="h-4 w-[93%] bg-sand-edge/30 rounded" />
        </div>

        {/* 进度条 */}
        <div className="mt-8 pt-5 border-t border-sand-edge/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-ink-dim">
              正在从原文提取全文内容…
            </span>
            <span className="text-xs font-mono text-amber-600">实时</span>
          </div>
          <div className="h-1.5 w-full bg-sand-edge/40 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full animate-progress-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
