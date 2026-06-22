"use client";

import { useState, useEffect, useRef } from "react";

// ========== 场景数据 ==========
const scenes = [
  {
    id: 1,
    title: "开场 · 消失的影子",
    subtitle: "SCENE 01 // THE VANISHING",
    narration:
      "2025年,一座被摄像头全面覆盖的城市。一群劫匪竟在AI的眼皮底下消失得无影无踪。监控画面定格在一片雨夜的霓虹中——没有人看到他们去了哪里。",
    bg: "linear-gradient(135deg, #0a0118 0%, #1a0a3a 50%, #2d1b4e 100%)",
    accent: "#36f4ff",
    imagePrompt:
      "雨夜的香港街道,蓝色监控屏幕闪烁红光,霓虹灯倒映在湿滑的柏油路面,冷蓝色调,港式警匪片风格,电影级构图,悬疑紧张气氛,镜头缓慢推进",
    icon: "📹",
  },
  {
    id: 2,
    title: "人物 · 老派与科技",
    subtitle: "SCENE 02 // TWO WORLDS COLLIDE",
    narration:
      "71岁的退休追踪专家黄德忠,凭借一双慧眼与半生经验,重新出山。67岁的犯罪天才傅隆生,代号影子,率领高智商犯罪团伙,用AI技术布下天罗地网。一警一匪,一传统一科技,一场跨越时代的猫鼠游戏就此展开。",
    bg: "linear-gradient(135deg, #1a0533 0%, #3d1a5c 50%, #5a1f3d 100%)",
    accent: "#ff2e97",
    imagePrompt:
      "昏暗的菜市场内,一位年迈的老警察与一位瘦削阴鸷的中年男人擦肩而过,两人眼神对峙,空气中弥漫着无形的压迫感,周围的人群和蔬菜摊位在背景中模糊,冷色调,港式警匪片风格",
    icon: "👁️",
  },
  {
    id: 3,
    title: "高潮 · 动作盛宴",
    subtitle: "SCENE 03 // ACTION SPECTACLE",
    narration:
      "从洗衣房的晾衣杆横扫,到阳台的纵身一跃;从狭窄楼道的近身肉搏,到街头的极速追车。成龙褪去年轻光环,坦然演绎岁月痕迹——走路扶腰、打斗后喘气,却在关键时刻凭经验制敌。梁家辉阁楼对决中,67岁的他在1.2米逼仄空间,以跪姿趴姿完成肉搏,刀刃距喉咙仅两指宽。",
    bg: "linear-gradient(135deg, #2a0a1a 0%, #4e1a2d 50%, #6b1f3d 100%)",
    accent: "#b4ff39",
    imagePrompt:
      "狭窄的香港老式公寓楼道内,激烈的肉搏战,晾衣杆横扫,动作快速有力,汗水飞溅,从洗衣房追逐到阳台再跳下,跑酷风格的动作镜头,港式动作片,动感十足,电影级剪辑",
    icon: "⚡",
  },
  {
    id: 4,
    title: "暗线 · 狼群法则",
    subtitle: "SCENE 04 // THE WOLF PACK",
    narration:
      "影片最烧脑的,藏在警匪追逐之下。老狼王傅隆生用一套旧规矩掌控一切,而新一代养子们在新技术和新野心的驱使下渴望取而代之。天才黑客熙蒙认为父亲的规矩过时了,策划弑父夺权。但真正的幕后黑手,是从未在正片中正式露面的老三——那个隐藏在暗网中的顶级黑客。",
    bg: "linear-gradient(135deg, #0a1a2a 0%, #1a3d4e 50%, #2d5a5c 100%)",
    accent: "#9d4bff",
    imagePrompt:
      "地铁站内,一个神秘男人在阴影中对另一个人耳语,周围是模糊的人流和闪烁的地铁广告牌,冷蓝色调与阴影交错,悬疑氛围浓烈,人物剪影风格,港式警匪片",
    icon: "🕷️",
  },
  {
    id: 5,
    title: "升华 · 时代与人",
    subtitle: "SCENE 05 // HUMANITY IN THE AGE OF AI",
    narration:
      "当AI、大数据主宰犯罪,老派的经验、直觉、坚守是否还有价值?影片给出答案——科技是工具,人心才是根本。黄德忠与年轻警员的师徒传承,傅隆生与养子们的伪父子关系,两组对照打破了警匪片非黑即白的二元对立。在追逃厮杀中,藏着人性的执念、救赎与传承。",
    bg: "linear-gradient(135deg, #1a0a33 0%, #2d1a5c 50%, #4e3a7d 100%)",
    accent: "#36f4ff",
    imagePrompt:
      "监狱探访室的玻璃隔断两侧,老警察与犯罪头子的镜像对峙,一边是正义的坚守一边是罪恶的狡黠,画面中间的玻璃反射出两人重叠的身影,背景是闪烁的监控屏幕和数据代码,AI时代人机博弈的隐喻,冷蓝灰色调,深刻压抑",
    icon: "🔮",
  },
  {
    id: 6,
    title: "结局 · 风散影消",
    subtitle: "SCENE 06 // THE WIND SETTLES",
    narration:
      "熙蒙临死前在影子耳边念出的12个英文单词,是百亿加密货币的助记词——提款密钥。最后一个单词Escalate,完美预示第二部的故事走向。影子故意败给年轻女警,主动进入监狱寻求庇护。因为他知道,此时全世界只有他掌握那笔巨款,监狱反而是最安全的地方。",
    bg: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3d 50%, #2d2d5c 100%)",
    accent: "#ff7edb",
    imagePrompt:
      "监狱铁栅栏后的剪影,一个老人坐在阴暗的牢房中,透过小窗户看着外面的世界,墙上隐约可见代码和英文单词的投影,冷色调,电影级光线运用,港式警匪片结局氛围,留白与悬念",
    icon: "🌙",
  },
];

// ========== 免费工具列表 ==========
const freeTools = [
  {
    name: "Free.ai",
    url: "https://free.ai/video/text-to-video",
    desc: "免费文生视频,CogVideoX模型,30-120秒生成",
    tag: "🎬 视频",
  },
  {
    name: "Z-Image",
    url: "https://zimage.run",
    desc: "无需登录,免费生成高质量图片,4步采样",
    tag: "🖼️ 图片",
  },
  {
    name: "PictoFlux",
    url: "https://pictoflux.com",
    desc: "免注册,多模型切换(Flux/Z-Image)",
    tag: "🖼️ 图片",
  },
  {
    name: "Raphael AI",
    url: "https://raphael.ai",
    desc: "完全免费·无限制·Flux.1模型,写实风格",
    tag: "🖼️ 图片",
  },
];

export default function MovieReviewPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showNarration, setShowNarration] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放逻辑
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentScene((prev) => (prev + 1) % scenes.length);
      }, 8000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const scene = scenes[currentScene];

  const goToScene = (idx: number) => {
    setCurrentScene(idx);
  };

  const next = () => setCurrentScene((p) => (p + 1) % scenes.length);
  const prev = () => setCurrentScene((p) => (p - 1 + scenes.length) % scenes.length);

  return (
    <div className="relative min-h-screen">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-cyber-grid opacity-40 pointer-events-none"></div>
      <div className="absolute inset-0 bg-scanlines opacity-[0.03] pointer-events-none"></div>

      {/* 动态光晕 */}
      <div
        className="orb absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{ background: `${scene.accent}20`, transition: "background 2s ease" }}
      ></div>
      <div
        className="orb absolute top-40 -right-20 w-[500px] h-[500px] rounded-full"
        style={{ background: `${scene.accent}15`, animationDelay: "2s", transition: "background 2s ease" }}
      ></div>

      <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-24">
        {/* ============ 顶部标题 ============ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-cyber-pink/40 bg-cyber-pink/[0.06] text-xs font-mono mb-6">
            <span className="pulse-dot"></span>
            <span className="text-cyber-pink tracking-widest">MOVIE REVIEW</span>
            <span className="text-[#6a4fa0]">//</span>
            <span className="text-[#c29bff]">捕风追影 · 2025</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1] mb-4">
            <span className="text-white">当</span>
            <span style={{ color: scene.accent, textShadow: `0 0 20px ${scene.accent}80` }}>
              老派经验
            </span>
            <span className="text-white">遭遇</span>
            <br />
            <span className="text-gradient-brand">AI 犯罪</span>
          </h1>

          <p className="text-sm md:text-base text-[#b8a8d9] max-w-2xl mx-auto leading-relaxed mt-6">
            71岁成龙 · 67岁梁家辉 · 杨子导演作品
            <br />
            近十年最佳港式警匪动作片,一场关于时代与人性的硬核碰撞
          </p>

          {/* 影片数据 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-3xl mx-auto">
            {[
              { label: "导演", value: "杨子" },
              { label: "主演", value: "成龙 / 梁家辉" },
              { label: "类型", value: "动作 / 悬疑" },
              { label: "评分", value: "8.6", accent: true },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div
                  className="text-xl md:text-2xl font-black"
                  style={{ color: s.accent ? scene.accent : "#fff" }}
                >
                  {s.value}
                </div>
                <div className="text-terminal-xs md:text-xs text-[#8a78b8] mt-1 font-mono uppercase tracking-[0.2em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 辉光分割线 */}
        <div
          aria-hidden
          className="max-w-4xl mx-auto h-px my-8"
          style={{ background: `linear-gradient(90deg, transparent, ${scene.accent}, transparent)` }}
        ></div>

        {/* ============ 视频播放器 ============ */}
        <div className="terminal-card mb-8">
          {/* 终端顶栏 */}
          <div className="terminal-card-top">
            <span style={{ background: "#ff5f56" }}></span>
            <span style={{ background: "#ffbd2e" }}></span>
            <span style={{ background: "#27c93f" }}></span>
            <div className="flex-1 text-center">
              <span className="text-terminal-sm font-mono text-[#c29bff] tracking-wider">
                CATCHING_SHADOW_REVIEW.mp4 · 自动播放中
              </span>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-terminal-sm font-mono text-cyber-cyan hover:text-white transition-colors"
            >
              {isPlaying ? "⏸ 暂停" : "▶ 播放"}
            </button>
          </div>

          {/* 视频画面区域 */}
          <div
            className="relative aspect-video overflow-hidden"
            style={{ background: scene.bg, transition: "background 1.5s ease" }}
          >
            {/* 画面装饰层 */}
            <div className="absolute inset-0 bg-scanlines opacity-[0.08]"></div>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)`,
              }}
            ></div>

            {/* 动态霓虹光 */}
            <div
              className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ background: `${scene.accent}30`, animation: "float 5s ease-in-out infinite" }}
            ></div>
            <div
              className="absolute -top-20 right-1/4 w-80 h-80 rounded-full blur-3xl"
              style={{
                background: `${scene.accent}20`,
                animation: "float 7s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            ></div>

            {/* 场景内容 */}
            <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-16">
              {/* 场景编号 */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span
                  className="text-2xl"
                  style={{
                    filter: `drop-shadow(0 0 10px ${scene.accent})`,
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  {scene.icon}
                </span>
                <span className="text-terminal-xs md:text-xs font-mono tracking-[0.2em] text-white/60">
                  {scene.subtitle}
                </span>
              </div>

              {/* 时间码 */}
              <div className="absolute top-6 right-6 text-terminal-xs md:text-xs font-mono text-white/50">
                00:{String(currentScene * 8).padStart(2, "0")}:00 / 00:00:48
              </div>

              {/* 主画面文字 */}
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-black text-center leading-tight mb-4"
                style={{
                  color: "#fff",
                  textShadow: `0 0 30px ${scene.accent}60, 0 0 60px ${scene.accent}30`,
                  opacity: 0,
                  animation: "fadeIn 1s ease forwards",
                  animationDelay: "0.3s",
                }}
                key={`title-${currentScene}`}
              >
                {scene.title}
              </h2>

              {/* 进度条 */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className="h-full transition-all duration-100"
                  style={{
                    width: `${((currentScene + 1) / scenes.length) * 100}%`,
                    background: `linear-gradient(90deg, ${scene.accent}, #ff2e97)`,
                    boxShadow: `0 0 20px ${scene.accent}`,
                  }}
                ></div>
              </div>

              {/* 左下角场景切换指示器 */}
              <div className="absolute bottom-6 left-6 flex gap-2">
                {scenes.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToScene(i)}
                    className="transition-all"
                    style={{
                      width: i === currentScene ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      background: i === currentScene ? scene.accent : "rgba(255,255,255,0.2)",
                      boxShadow: i === currentScene ? `0 0 12px ${scene.accent}` : "none",
                    }}
                  />
                ))}
              </div>

              {/* 右下角操作 */}
              <div className="absolute bottom-6 right-6 flex gap-2">
                <button
                  onClick={prev}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 text-sm transition-all"
                >
                  ←
                </button>
                <button
                  onClick={next}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 text-sm transition-all"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* 解说文案区域 */}
          <div className="p-6 md:p-8 border-t border-cyber-violet/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-mono tracking-widest"
                  style={{ color: scene.accent }}
                >
                  ▎旁白解说
                </span>
                <span className="text-xs text-white/40 font-mono">
                  SCENE {String(currentScene + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                </span>
              </div>
              <button
                onClick={() => setShowNarration(!showNarration)}
                className="text-xs text-[#c29bff] hover:text-white transition-colors"
              >
                {showNarration ? "隐藏文案" : "显示文案"}
              </button>
            </div>

            {showNarration && (
              <p
                key={`narration-${currentScene}`}
                className="text-base md:text-lg leading-loose text-white/90"
                style={{
                  opacity: 0,
                  animation: "slideUp 0.8s ease forwards",
                  animationDelay: "0.2s",
                }}
              >
                {scene.narration}
              </p>
            )}
          </div>
        </div>

        {/* ============ 画面提示词卡片 ============ */}
        <div className="neon-card mb-8 p-6 md:p-8">
          <div className="cyber-label mb-4" style={{ color: scene.accent }}>
            ▎AI 画面生成提示词
          </div>
          <p className="text-xs text-[#8a78b8] mb-4">
            复制以下提示词,粘贴到免费图片/视频生成工具,即可生成对应场景画面
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {scenes.slice(0, 4).map((s, idx) => (
              <div
                key={s.id}
                className="group p-4 rounded-xl bg-black/30 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => goToScene(idx)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-mono text-white/60">{s.subtitle}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                  {s.imagePrompt}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(s.imagePrompt);
                  }}
                  className="mt-3 text-terminal-sm text-cyber-cyan hover:text-white transition-colors font-mono"
                >
                  📋 点击复制提示词
                </button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {scenes.slice(4).map((s, idx) => (
              <div
                key={s.id}
                className="group p-4 rounded-xl bg-black/30 border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                onClick={() => goToScene(idx + 4)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-mono text-white/60">{s.subtitle}</span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed line-clamp-3">
                  {s.imagePrompt}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(s.imagePrompt);
                  }}
                  className="mt-3 text-terminal-sm text-cyber-cyan hover:text-white transition-colors font-mono"
                >
                  📋 点击复制提示词
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============ 免费工具推荐 ============ */}
        <div className="terminal-card mb-8">
          <div className="terminal-card-top">
            <span style={{ background: "#ff5f56" }}></span>
            <span style={{ background: "#ffbd2e" }}></span>
            <span style={{ background: "#27c93f" }}></span>
            <div className="flex-1 text-center">
              <span className="text-terminal-sm font-mono text-[#c29bff] tracking-wider">
                FREE_TOOLS.sh · 无需注册 · 无需 API Key
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="cyber-label mb-4" style={{ color: "#7ff0ff" }}>
              ▎免费工具推荐
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {freeTools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card glass-card-hover p-4 block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-cyber-pink font-mono">{tool.tag}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-1">{tool.name}</h3>
                      <p className="text-xs text-[#b8a8d9] leading-relaxed">{tool.desc}</p>
                    </div>
                    <span className="text-cyber-cyan text-lg">→</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className="text-terminal-xs font-mono text-white/40">{tool.url}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-cyber-lime/[0.04] border border-cyber-lime/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div className="text-sm text-[#d1ff7a]/90 leading-relaxed">
                  <span className="font-bold text-cyber-lime">使用技巧:</span>
                  先生成图片(用 Z-Image / PictoFlux),然后将图片导入视频工具(如 Free.ai)作为首帧,
                  输入动作描述生成视频片段,最后用剪映等工具剪辑拼接并配音。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ 完整解说文案 ============ */}
        <div className="neon-card mb-8 p-6 md:p-8">
          <div className="cyber-label mb-4">▎完整解说文案 · 可直接用于配音</div>

          <div className="space-y-6 text-base leading-loose text-white/85">
            <div>
              <div className="text-xs font-mono text-cyber-cyan mb-2">[开场 · 0-8秒]</div>
              <p>2025年,一座被摄像头全面覆盖的城市。一群劫匪竟在AI的眼皮底下消失得无影无踪。监控画面定格在一片雨夜的霓虹中——没有人看到他们去了哪里。</p>
            </div>

            <div className="border-l-2 border-cyber-pink/30 pl-4">
              <div className="text-xs font-mono text-cyber-pink mb-2">[人物引入 · 8-16秒]</div>
              <p>
                71岁的退休追踪专家<span className="text-cyber-pink font-semibold">黄德忠</span>,凭借一双慧眼与半生经验,重新出山。
                67岁的犯罪天才<span className="text-cyber-cyan font-semibold">傅隆生</span>,代号影子,率领高智商犯罪团伙,用AI技术布下天罗地网。
                一警一匪,一传统一科技,一场跨越时代的猫鼠游戏就此展开。
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-cyber-lime mb-2">[动作场面 · 16-24秒]</div>
              <p>
                从洗衣房的晾衣杆横扫,到阳台的纵身一跃;从狭窄楼道的近身肉搏,到街头的极速追车。
                成龙褪去年轻光环,坦然演绎岁月痕迹——走路扶腰、打斗后喘气,却在关键时刻凭经验制敌。
                梁家辉阁楼对决中,67岁的他在1.2米逼仄空间,以跪姿趴姿完成肉搏,刀刃距喉咙仅两指宽。
              </p>
            </div>

            <div className="border-l-2 border-cyber-violet/30 pl-4">
              <div className="text-xs font-mono text-[#c29bff] mb-2">[暗线揭秘 · 24-32秒]</div>
              <p>
                影片最烧脑的,藏在警匪追逐之下。老狼王傅隆生用一套旧规矩掌控一切,而新一代养子们在新技术和新野心的驱使下渴望取而代之。
                天才黑客熙蒙认为父亲的规矩过时了,策划弑父夺权。但真正的幕后黑手,是从未在正片中正式露面的老三——那个隐藏在暗网中的顶级黑客。
              </p>
            </div>

            <div>
              <div className="text-xs font-mono text-[#36f4ff] mb-2">[主题升华 · 32-40秒]</div>
              <p>
                当AI、大数据主宰犯罪,老派的经验、直觉、坚守是否还有价值?影片给出答案——
                <span className="text-white font-semibold">科技是工具,人心才是根本</span>。
                黄德忠与年轻警员的师徒传承,傅隆生与养子们的伪父子关系,两组对照打破了警匪片非黑即白的二元对立。
                在追逃厮杀中,藏着人性的执念、救赎与传承。
              </p>
            </div>

            <div className="border-l-2 border-[#ff7edb]/30 pl-4">
              <div className="text-xs font-mono text-[#ff7edb] mb-2">[结局悬念 · 40-48秒]</div>
              <p>
                熙蒙临死前在影子耳边念出的12个英文单词,是百亿加密货币的助记词——提款密钥。
                最后一个单词Escalate,完美预示第二部的故事走向。
                影子故意败给年轻女警,主动进入监狱寻求庇护。因为他知道,此时全世界只有他掌握那笔巨款,监狱反而是最安全的地方。
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10">
              <div className="text-xs font-mono text-gradient-brand mb-2">[结尾引导]</div>
              <p className="text-white/90">
                风会停,影会散,但坚守与匠心永不落幕。如果你也被这部电影打动,欢迎点赞分享,让更多人看到这部港片的新生。
              </p>
            </div>
          </div>
        </div>

        {/* ============ 底部 CTA ============ */}
        <div className="text-center">
          <div className="inline-flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  scenes.map((s, i) => `[场景${i + 1}] ${s.narration}`).join("\n\n")
                );
              }}
              className="btn-neon"
            >
              📋 复制全部文案
            </button>
            <button
              onClick={() => {
                setCurrentScene(0);
                setIsPlaying(true);
              }}
              className="btn-ghost"
            >
              ↻ 重新播放
            </button>
          </div>
          <p className="text-xs text-white/40 mt-6 font-mono">
            // 提示:用手机屏幕录制功能 + 浏览器自动播放,即可生成视频素材
          </p>
        </div>
      </div>

      {/* ============ 动画关键帧(内联样式) ============ */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
