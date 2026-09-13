export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-ink-main mb-2">正在加载资讯…</h2>
        <p className="text-sm text-ink-sub max-w-md">
          正在整理最新的中文 AI 产品、行业与应用动态。
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-b border-sand-edge py-5 animate-pulse"
          >
            <div className="h-3 w-24 bg-sand-edge/60 rounded mb-3" />
            <div className="h-5 w-4/5 bg-sand-edge/40 rounded mb-2" />
            <div className="h-4 w-2/3 bg-sand-edge/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
