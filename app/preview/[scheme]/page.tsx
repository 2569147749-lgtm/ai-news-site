import Link from "next/link";

const schemes: Record<string, {
  id: string;
  name: string;
  tag: string;
  desc: string;
  bg: string;
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textSub: string;
  primary: string;
  secondary: string;
  accent: string;
  badge: string;
}> = {
  e: {
    id: "e",
    name: "薄荷·晨",
    tag: "方案 E",
    desc: "浅紫奶白 + 紫青渐变 · 未来感最足的亮色方案",
    bg: "#f5f3ff",
    cardBg: "#ffffff",
    cardBorder: "#e0d8ff",
    textMain: "#1e1b4b",
    textSub: "#667085",
    primary: "#7c3aed",
    secondary: "#22d3ee",
    accent: "#f472b6",
    badge: "紫·青·粉",
  },
  f: {
    id: "f",
    name: "琉璃·琥珀",
    tag: "方案 F",
    desc: "米白暖调 + 琥珀金点缀 · 文艺温暖不冷",
    bg: "#fffbf2",
    cardBg: "#fffdf8",
    cardBorder: "#f0e6d0",
    textMain: "#3d2e1e",
    textSub: "#8a7a66",
    primary: "#f59e0b",
    secondary: "#06b6d4",
    accent: "#ef4444",
    badge: "金·青·红",
  },
  g: {
    id: "g",
    name: "晴海",
    tag: "方案 G",
    desc: "淡蓝白 + 珊瑚粉 · 活泼清新的 SaaS 风",
    bg: "#f0f9ff",
    cardBg: "#ffffff",
    cardBorder: "#d6e4f5",
    textMain: "#0f172a",
    textSub: "#64748b",
    primary: "#0ea5e9",
    secondary: "#fb7185",
    accent: "#22d3ee",
    badge: "蓝·粉·青",
  },
  h: {
    id: "h",
    name: "春日·柔",
    tag: "方案 H",
    desc: "近纯白 + 紫青粉点缀 · 最清新、最耐读",
    bg: "#fafafa",
    cardBg: "#ffffff",
    cardBorder: "#e4e4e7",
    textMain: "#18181b",
    textSub: "#71717a",
    primary: "#8b5cf6",
    secondary: "#06b6d4",
    accent: "#ec4899",
    badge: "紫·青·粉",
  },
};

export function generateMetadata({ params }: { params: { scheme: string } }) {
  const s = schemes[params.scheme] || schemes.e;
  return {
    title: `${s.name} · 色系预览`,
  };
}

const newsCards = [
  {
    source: "the_verge",
    category: "行业动态",
    title: "OpenAI 发布新一代多模态模型 GPT-6，支持视频与 3D 场景理解",
    summary:
      "新模型在视觉理解任务上比前代提升 3 倍，支持 4K 视频输入与结构化 3D 场景理解，响应速度提升 40%。",
    time: "2h ago",
  },
  {
    source: "arstechnica",
    category: "产品发布",
    title: "Anthropic 推出 Claude Sonnet 3.7：更长上下文 + 更强推理",
    summary:
      "Claude Sonnet 3.7 将上下文窗口扩展到 400K，并在数学与代码评测上接近 Opus 水平，价格仅为后者的 1/5。",
    time: "5h ago",
  },
  {
    source: "techcrunch",
    category: "研究前沿",
    title: "Meta 开源 Llama 4：多模态原生 + 1M 上下文 + 实时工具调用",
    summary:
      "Llama 4 系列包含 8B / 30B 两种尺寸，首次在开源模型中提供原生图像理解能力，MIT 许可免费商用。",
    time: "1d ago",
  },
];

export default function SchemePreviewPage({ params }: { params: { scheme: string } }) {
  const s = schemes[params.scheme] || schemes.e;

  const heroBg = `radial-gradient(circle at 20% 10%, ${s.primary}22 0%, transparent 45%), radial-gradient(circle at 80% 20%, ${s.secondary}22 0%, transparent 50%), radial-gradient(circle at 50% 90%, ${s.accent}18 0%, transparent 55%), ${s.bg}`;

  return (
    <div className="min-h-screen" style={{ background: s.bg }}>
      {/* 返回链接 */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 text-terminal-base font-mono hover:underline"
          style={{ color: s.primary }}
        >
          ← 返回 /preview（全部色系）
        </Link>
      </div>

      {/* HERO 区 */}
      <section
        className="relative overflow-hidden"
        style={{ background: heroBg }}
      >
        <div className="max-w-5xl mx-auto px-4 pt-14 pb-20 text-center">
          {/* LIVE pill */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ background: s.primary }}
            ></span>
            <span
              className="text-terminal-sm font-mono tracking-widest px-3 py-1 rounded-full"
              style={{
                background: `${s.primary}15`,
                color: s.primary,
                border: `1px solid ${s.primary}30`,
              }}
            >
              LIVE · {s.tag}
            </span>
          </div>

          {/* 大标题 */}
          <h1
            className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6"
            style={{
              color: s.textMain,
            }}
          >
            <span
              style={{
                background: `linear-gradient(90deg, ${s.primary}, ${s.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              掌握全球 AI 脉搏
            </span>
            <br />
            每天 5 分钟洞察未来
          </h1>

          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: s.textSub }}
          >
            {s.name} — {s.desc}。
          </p>

          {/* 按钮 */}
          <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-terminal-base font-mono font-bold px-6 py-3 rounded-full shadow-sm hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(90deg, ${s.primary}, ${s.secondary})`,
                color: "#fff",
              }}
            >
              开始阅读 →
            </Link>
            <Link
              href="/preview"
              className="inline-flex items-center gap-2 text-terminal-base font-mono px-6 py-3 rounded-full border"
              style={{
                background: s.cardBg,
                color: s.textMain,
                borderColor: s.cardBorder,
              }}
            >
              浏览今日新闻
            </Link>
          </div>

          {/* 3 个数字卡 */}
          <div className="grid grid-cols-3 gap-3 md:gap-5 max-w-3xl mx-auto">
            {[
              { n: "10+", l: "覆盖话题" },
              { n: "24", l: "小时更新" },
              { n: "5", l: "分钟阅读" },
            ].map((it) => (
              <div
                key={it.l}
                className="rounded-2xl p-5 md:p-6 border"
                style={{
                  background: s.cardBg,
                  borderColor: s.cardBorder,
                }}
              >
                <div
                  className="text-3xl md:text-5xl font-black mb-1"
                  style={{
                    background: `linear-gradient(90deg, ${s.primary}, ${s.secondary})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {it.n}
                </div>
                <div className="text-terminal-sm font-mono tracking-wider" style={{ color: s.textSub }}>
                  {it.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 新闻卡片区 */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            className="text-2xl md:text-3xl font-black tracking-tight"
            style={{ color: s.textMain }}
          >
            今日精选 · 3 条
          </h2>
          <Link
            href="/preview"
            className="text-[12px] font-mono"
            style={{ color: s.primary }}
          >
            查看全部 →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {newsCards.map((n) => (
            <article
              key={n.title}
              className="rounded-2xl p-5 border transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: s.cardBg,
                borderColor: s.cardBorder,
              }}
            >
              {/* source + category */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span
                  className="text-terminal-sm font-mono px-2.5 py-1 rounded-full"
                  style={{
                    background: `${s.primary}15`,
                    color: s.primary,
                    border: `1px solid ${s.primary}30`,
                  }}
                >
                  {n.source}
                </span>
                <span
                  className="text-terminal-sm font-mono px-2.5 py-1 rounded-full"
                  style={{
                    background: `${s.secondary}15`,
                    color: s.secondary,
                    border: `1px solid ${s.secondary}30`,
                  }}
                >
                  {n.category}
                </span>
              </div>

              {/* 标题 */}
              <h3
                className="text-lg font-bold leading-snug mb-2"
                style={{ color: s.textMain }}
              >
                {n.title}
              </h3>

              {/* 摘要 */}
              <p className="text-terminal-base leading-relaxed mb-4" style={{ color: s.textSub }}>
                {n.summary}
              </p>

              {/* 底部 */}
              <div
                className="pt-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${s.cardBorder}` }}
              >
                <span className="text-terminal-sm font-mono" style={{ color: s.textSub }}>
                  {n.time}
                </span>
                <span className="text-terminal-sm font-mono" style={{ color: s.primary }}>
                  阅读 →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Terminal 风格详情卡 */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tight mb-6"
          style={{ color: s.textMain }}
        >
          深度解读 · terminal_view
        </h2>

        <div
          className="rounded-2xl overflow-hidden border shadow-sm"
          style={{
            background: s.cardBg,
            borderColor: s.cardBorder,
          }}
        >
          {/* macOS 风格顶部栏 */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{
              background: s.bg,
              borderBottom: `1px solid ${s.cardBorder}`,
            }}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#ff5f57" }}
            ></span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#febc2e" }}
            ></span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: "#28c840" }}
            ></span>
            <span
              className="ml-3 text-[12px] font-mono"
              style={{ color: s.textSub }}
            >
              arua-daily — summary.sh
            </span>
          </div>

          {/* 终端内容 */}
          <div className="p-6 md:p-8">
            <div className="font-mono text-terminal-base leading-7 space-y-2">
              <div style={{ color: s.primary }}>
                $ <span style={{ color: s.textMain }}>aura summary --today --scheme {s.id}</span>
              </div>
              <div style={{ color: s.textSub }}>
                <span style={{ color: s.secondary }}>»</span> 正在抓取 12 个源、过滤重复与低质量内容…
              </div>
              <div style={{ color: s.textSub }}>
                <span style={{ color: s.secondary }}>»</span> 提取关键观点、按「研究 / 产品 / 政策」分组…
              </div>
              <div style={{ color: s.textSub }}>
                <span style={{ color: s.secondary }}>»</span> 生成结构化 5 分钟阅读摘要。
              </div>
            </div>

            <div
              className="mt-6 pt-6"
              style={{ borderTop: `1px dashed ${s.cardBorder}` }}
            >
              <div
                className="text-terminal-sm font-mono tracking-widest mb-3"
                style={{ color: s.primary }}
              >
                // KEY · INSIGHT · 01
              </div>
              <h3
                className="text-xl font-bold leading-snug mb-3"
                style={{ color: s.textMain }}
              >
                多模态模型进入「视频 + 3D」时代，文本不再是唯一输入
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: s.textSub }}
              >
                从 GPT-6 开始，大模型的输入窗口从「长文本」转向「长视频 + 结构化 3D 场景」，
                这意味着新一轮应用浪潮将围绕<strong style={{ color: s.primary }}>空间理解、沉浸式交互、机器人</strong>
                展开，而非仅仅是聊天助手。
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: s.textSub }}
              >
                对普通读者而言，最重要的变化是：<strong style={{ color: s.primary }}>
                  视频内容首次被真正「理解」
                </strong>
                。你可以向一段 4K 教学视频提问、让模型提取演示步骤、甚至把一段演讲直接变成可交互的演示程序。
              </p>
            </div>

            <div
              className="mt-6 pt-6"
              style={{ borderTop: `1px dashed ${s.cardBorder}` }}
            >
              <div
                className="text-terminal-sm font-mono tracking-widest mb-3"
                style={{ color: s.secondary }}
              >
                // KEY · INSIGHT · 02
              </div>
              <h3
                className="text-xl font-bold leading-snug mb-3"
                style={{ color: s.textMain }}
              >
                开源模型继续逼近闭源天花板，价格战进入「推理级别」
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: s.textSub }}
              >
                Claude Sonnet 3.7 / Llama 4 的发布进一步压缩了「顶级模型」与「主力模型」的差距。
                对大多数日常任务，<strong style={{ color: s.secondary }}>
                  成本 1/5 的主力级模型已足够好用
                </strong>
                。真正贵的是推理本身，而不是模型参数。
              </p>
            </div>

            <div
              className="mt-6 pt-6 flex items-center gap-3 flex-wrap"
              style={{ borderTop: `1px dashed ${s.cardBorder}` }}
            >
              <span
                className="text-terminal-sm font-mono tracking-widest"
                style={{ color: s.accent }}
              >
                // END · OF · SUMMARY
              </span>
              <span className="text-terminal-sm font-mono" style={{ color: s.textSub }}>
                总耗时 ~4.2s · 压缩率 38 : 1 · 由 {s.name} 渲染
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 色号参考栏 */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <h2
          className="text-2xl md:text-3xl font-black tracking-tight mb-6"
          style={{ color: s.textMain }}
        >
          色系参考 · palette
        </h2>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: s.cardBg,
            borderColor: s.cardBorder,
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5">
            {[
              { label: "primary", hex: s.primary, kind: "主色" },
              { label: "secondary", hex: s.secondary, kind: "次色" },
              { label: "accent", hex: s.accent, kind: "点缀" },
              { label: "text_main", hex: s.textMain, kind: "正文" },
              { label: "text_sub", hex: s.textSub, kind: "辅助" },
            ].map((c) => (
              <div
                key={c.label}
                className="p-5"
                style={{
                  borderRight: `1px solid ${s.cardBorder}`,
                  borderBottom: `1px solid ${s.cardBorder}`,
                }}
              >
                <div
                  className="w-full h-16 rounded-xl mb-3 shadow-sm"
                  style={{ background: c.hex }}
                ></div>
                <div
                  className="text-terminal-sm font-mono tracking-wider mb-1"
                  style={{ color: s.textSub }}
                >
                  {c.kind}
                </div>
                <div
                  className="text-terminal-base font-mono font-bold"
                  style={{ color: s.textMain }}
                >
                  {c.hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <div
            className="grid grid-cols-2"
            style={{ borderTop: `1px solid ${s.cardBorder}` }}
          >
            {[
              { label: "bg", hex: s.bg, kind: "页面背景" },
              { label: "card_bg", hex: s.cardBg, kind: "卡片背景" },
            ].map((c) => (
              <div key={c.label} className="p-5" style={{}}>
                <div
                  className="w-full h-16 rounded-xl mb-3 shadow-sm border"
                  style={{
                    background: c.hex,
                    borderColor: s.cardBorder,
                  }}
                ></div>
                <div
                  className="text-terminal-sm font-mono tracking-wider mb-1"
                  style={{ color: s.textSub }}
                >
                  {c.kind}
                </div>
                <div
                  className="text-terminal-base font-mono font-bold"
                  style={{ color: s.textMain }}
                >
                  {c.hex.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-4 text-center text-[12px] font-mono"
          style={{ color: s.textSub }}
        >
          palette_name: "{s.name}" · tags: {s.badge}
        </div>
      </section>

      {/* 浮动「选择这套色系」按钮 */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/preview"
          className="inline-flex items-center gap-2 text-terminal-base font-mono font-bold px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
          style={{
            background: `linear-gradient(90deg, ${s.primary}, ${s.secondary})`,
            color: "#fff",
          }}
        >
          ✓ 选择「{s.name}」
        </Link>
      </div>

      {/* 底部留白 */}
      <div className="pb-24"></div>
    </div>
  );
}
