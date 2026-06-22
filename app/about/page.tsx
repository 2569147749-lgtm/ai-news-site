import Link from "next/link";
import { rssSources } from "@/config/sources";

export const metadata = {
  title: "关于 · Aura Daily",
  description: "关于本站的技术栈、信息来源与使用说明。",
};

export default function AboutPage() {
  const techStack = [
    { label: "前端框架", value: "Next.js 14 + TypeScript + Tailwind CSS" },
    { label: "数据抓取", value: "rss-parser" },
    { label: "存储", value: "Vercel KV（Redis）" },
    { label: "定时任务", value: "Vercel Cron Jobs（每小时抓取 / 每日早报）" },
    { label: "部署", value: "Vercel · 零运维" },
  ];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-sand-grid opacity-50 pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 py-14">
        {/* 页面标题 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-3">
            // ABOUT · SYSTEM
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink-main mb-4 tracking-tight">
            关于<span className="text-gradient-brand">本站</span>
          </h1>
          <p className="text-ink-sub text-base max-w-xl mx-auto">
            AI 每日资讯是一个自动聚合全球 AI 领域动态的轻量资讯站
          </p>
        </div>

        {/* 分隔线 */}
        <div className="h-px bg-gradient-to-r from-transparent via-sand-dim to-transparent mb-10"></div>

        {/* 卡片组 */}
        <div className="space-y-5">
          {/* 我们做什么 */}
          <div className="neon-card p-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📡</span>
              <h2 className="text-xl font-bold text-ink-main">我们做什么</h2>
            </div>
            <p className="text-ink-sub leading-relaxed">
              <span className="text-amber-700 font-semibold">Aura Daily</span> 是一个自动聚合全球 AI 领域动态的资讯站，
              自动从 10+ 个信息源抓取 <span className="text-aqua font-semibold">新闻、论文、产品发布</span>，
              每天为你整理一份值得阅读的早报。
            </p>
          </div>

          {/* 技术栈 */}
          <div className="terminal-card">
            <div className="terminal-card-top">
              <span style={{ background: "#f59e0b" }}></span>
              <span style={{ background: "#06b6d4" }}></span>
              <span style={{ background: "#ef4444" }}></span>
              <span className="ml-2 text-terminal-sm font-mono text-ink-sub">~/stack.json</span>
            </div>
            <div className="p-7">
              <h2 className="text-lg font-bold text-ink-main mb-5 flex items-center gap-2">
                <span>🛠</span> 技术栈
              </h2>
              <div className="space-y-2.5 font-mono text-sm">
                {techStack.map((t) => (
                  <div key={t.label} className="flex items-start gap-3 py-2 border-b border-sand-edge last:border-0">
                    <span className="text-amber-700 text-xs font-bold min-w-[80px]">{t.label}</span>
                    <span className="text-ink-main text-sm">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 信息源 */}
          <div className="glass-card p-7">
            <h2 className="text-lg font-bold text-ink-main mb-2 flex items-center gap-2">
              <span>📚</span> 信息源（RSS）
            </h2>
            <p className="text-ink-sub text-sm mb-5">以下 {rssSources.length} 个站点是我们的数据来源：</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {rssSources.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-sand-card border border-sand-edge hover:border-amber-300 hover:shadow-card transition-all"
                >
                  <span className="chip-amber shrink-0 mt-0.5">{s.language.toUpperCase()}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink-main text-sm mb-0.5">{s.name}</div>
                    <div className="text-xs text-ink-sub truncate font-mono">{s.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 使用说明 */}
          <div className="terminal-card">
            <div className="terminal-card-top">
              <span style={{ background: "#f59e0b" }}></span>
              <span style={{ background: "#06b6d4" }}></span>
              <span style={{ background: "#ef4444" }}></span>
              <span className="ml-2 text-terminal-sm font-mono text-ink-sub">~/README.md</span>
            </div>
            <div className="p-7">
              <h2 className="text-lg font-bold text-ink-main mb-5 flex items-center gap-2">
                <span>📖</span> 使用说明
              </h2>
              <ol className="space-y-3 text-sm text-ink-sub">
                <li className="flex items-start gap-3">
                  <span className="chip-amber font-mono mt-0.5 shrink-0">01</span>
                  <span><strong className="text-ink-main">浏览资讯</strong>：进入 <Link href="/news" className="text-aqua hover:text-amber-700 transition-colors font-mono">/news</Link> 查看最新资讯列表，支持点击卡片查看详情。</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="chip-amber font-mono mt-0.5 shrink-0">02</span>
                  <span><strong className="text-ink-main">每日早报</strong>：进入 <Link href="/daily" className="text-aqua hover:text-amber-700 transition-colors font-mono">/daily</Link> 按日期浏览每日动态汇总。</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="chip-amber font-mono mt-0.5 shrink-0">03</span>
                  <span><strong className="text-ink-main">站内搜索</strong>：在 <Link href="/search" className="text-aqua hover:text-amber-700 transition-colors font-mono">/search</Link> 搜索关键词、标题、标签。</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="chip-amber font-mono mt-0.5 shrink-0">04</span>
                  <span><strong className="text-ink-main">RSS 订阅</strong>：在 RSS 阅读器中订阅 <span className="font-mono text-amber-700">/rss.xml</span>，获取最新内容推送。</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="chip-amber font-mono mt-0.5 shrink-0">05</span>
                  <span><strong className="text-ink-main">手动更新</strong>：访问 <span className="font-mono text-aqua">/api/crawl</span> 可触发一次抓取（开发 / 调试使用）。</span>
                </li>
              </ol>
            </div>
          </div>

          {/* 声明 */}
          <div className="p-6 text-center text-xs text-ink-sub font-mono border border-sand-edge rounded-2xl bg-sand-card">
            <p>本站内容版权归原作者所有 · 仅做聚合与索引 · 不存储原文</p>
            <p className="mt-2">如有侵权请联系移除 · 欢迎反馈建议</p>
          </div>
        </div>
      </div>
    </div>
  );
}
