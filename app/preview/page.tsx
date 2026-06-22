import Link from "next/link";

const schemes = [
  {
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
  {
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
  {
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
  {
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
];

export default function PreviewPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)" }}
    >
      {/* 顶部标题区 */}
      <div className="max-w-6xl mx-auto px-4 pt-14 pb-10 text-center">
        <div
          className="text-terminal-sm tracking-[0.3em] font-mono mb-4"
          style={{ color: "#7c3aed" }}
        >
          // COLOR SCHEME PREVIEW
        </div>
        <h1
          className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          style={{ color: "#1e1b4b" }}
        >
          4 套清新亮色 · 选你喜欢的
        </h1>
        <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#667085" }}>
          下面 4 个卡片就是 4 个色系的「真实效果」预览。点卡片进去看完整页的 Hero + 新闻卡片 + 详情页效果。
        </p>
      </div>

      {/* 4 个方案卡片 */}
      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {schemes.map((s) => (
          <Link
            key={s.id}
            href={`/preview/${s.id}`}
            className="group relative block rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: s.bg, borderColor: s.cardBorder }}
          >
            {/* 方案标签（右上角） */}
            <div
              className="absolute top-4 right-4 text-terminal-sm font-mono tracking-wider px-3 py-1 rounded-full"
              style={{
                background: s.cardBg,
                color: s.primary,
                border: `1px solid ${s.cardBorder}`,
              }}
            >
              {s.tag}
            </div>

            {/* 主体内容 */}
            <div className="p-8 pt-12">
              <div
                className="text-xs tracking-[0.2em] font-mono mb-3"
                style={{ color: s.primary }}
              >
                SCHEME_{s.id.toUpperCase()}
              </div>
              <h2
                className="text-3xl font-black mb-3 leading-tight"
                style={{ color: s.textMain }}
              >
                {s.name}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: s.textSub }}>
                {s.desc}
              </p>

              {/* 模拟新闻卡 */}
              <div
                className="rounded-xl p-4 mb-5 border"
                style={{ background: s.cardBg, borderColor: s.cardBorder }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="text-terminal-sm font-mono px-2.5 py-1 rounded-full"
                    style={{
                      background: `${s.primary}15`,
                      color: s.primary,
                      border: `1px solid ${s.primary}30`,
                    }}
                  >
                    行业动态
                  </span>
                  <span
                    className="text-terminal-sm font-mono px-2.5 py-1 rounded-full"
                    style={{
                      background: `${s.secondary}15`,
                      color: s.secondary,
                      border: `1px solid ${s.secondary}30`,
                    }}
                  >
                    machine_learning
                  </span>
                  <span className="text-terminal-sm ml-auto font-mono" style={{ color: s.textSub }}>
                    2h ago
                  </span>
                </div>
                <div
                  className="text-sm font-bold leading-snug mb-1"
                  style={{ color: s.textMain }}
                >
                  OpenAI 发布新一代多模态模型 GPT-6…
                </div>
                <div
                  className="text-terminal-base leading-relaxed"
                  style={{ color: s.textSub }}
                >
                  新模型在视觉理解任务上比前代提升3倍…
                </div>
              </div>

              {/* 色号 swatches */}
              <div className="flex items-center gap-3 flex-wrap">
                {[s.primary, s.secondary, s.accent].map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 text-terminal-sm font-mono"
                    style={{ color: s.textSub }}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ background: c }}
                    ></span>
                    {c.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA 按钮 */}
            <div
              className="px-8 py-5 flex items-center justify-center"
              style={{ borderTop: `1px solid ${s.cardBorder}`, background: s.cardBg }}
            >
              <span
                className="inline-flex items-center gap-2 text-[12px] font-mono font-bold px-5 py-2.5 rounded-full shadow-sm transition-all group-hover:shadow-lg"
                style={{
                  background: `linear-gradient(90deg, ${s.primary}, ${s.secondary})`,
                  color: "#fff",
                }}
              >
                查看完整预览 →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="max-w-3xl mx-auto px-4 pb-16 text-center">
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "#ffffff", borderColor: "#e0d8ff" }}
        >
          <div
            className="text-terminal-sm tracking-widest font-mono mb-2"
            style={{ color: "#7c3aed" }}
          >
            // HOW TO CHOOSE
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "#3d2e1e" }}>
            点卡片进去看{" "}
            <span className="font-mono" style={{ color: "#7c3aed" }}>
              /preview/e
            </span>{" "}
            之类的完整效果。选好告诉我字母，我直接把整套主题换掉。
          </p>
        </div>
      </div>
    </div>
  );
}
