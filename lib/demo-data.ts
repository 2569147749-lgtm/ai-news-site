import { NewsItem } from "./types";

const DAY = 1000 * 60 * 60 * 24;

const demoItems: NewsItem[] = [
  {
    id: "demo-1",
    title: "OpenAI 发布全新推理模型 o3，数学能力再突破",
    link: "https://openai.com/index/introducing-o3/",
    summary:
      "OpenAI 本周发布最新一代推理模型 o3，在多项数学与代码基准测试中取得显著提升，同时降低了推理延迟。",
    content:
      "当地时间本周一，OpenAI 正式发布新一代推理模型系列 o3。这是继 o1 之后 OpenAI 在推理模型方向的又一次重大升级。\n\n核心性能指标如下：\n- MATH 基准测试：从 o1 的 96.3 提升至 o3 的 98.1\n- AIME 2024：从 73.0 提升至 85.2\n- Codeforces 评分：首次突破 2100 分\n\n与上一代相比，o3 同时优化了推理速度：在输出相同质量的回答时，推理 token 数平均减少 35%，响应延迟降低约 40%。\n\n发布会上 OpenAI 研究团队强调，o3 的核心改进并非来自模型规模的扩大，而是来自训练数据质量与推理算法的协同优化。首席技术官 Murati 在声明中表示：『我们证明了『更大』不一定等于『更好』，推理效率的提升同样可以带来指数级的能力增长。』\n\no3 即日起通过 API 对所有付费用户开放，价格与 o1-preview 保持一致。",
    source: "OpenAI 官方博客",
    sourceId: "openai-blog",
    category: "产品发布",
    language: "zh",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["大模型", "产品发布"],
  },
  {
    id: "demo-2",
    title: "Anthropic 推出 Claude 视频理解能力，支持长视频分析",
    link: "https://anthropic.com",
    summary:
      "Anthropic 宣布 Claude 系列模型新增视频理解能力，支持最长 1 小时视频的多模态分析，可用于内容审核与摘要场景。",
    content:
      "Anthropic 在其官方博客宣布 Claude 3.5 Sonnet 与 Claude Opus 已正式支持视频理解能力。用户可直接在对话中上传视频文件，模型将自动完成视频内容的逐帧分析、时间线标记与语义摘要。\n\n【主要能力】\n支持最长 1 小时、最高 1080p 的视频输入，能够输出时间轴级别的事件描述与关键帧识别，中英文混合字幕场景下识别精度良好。API 调用成本约为同等长度文本的 3-5 倍。\n\n【典型应用】\nAnthropic 特别强调了两类应用场景：企业会议录播自动摘要，以及面向儿童/敏感内容的视频审核。据内部测试，在暴力/色情识别任务上，Claude 视频模块与人工审核的一致性达到 97.4%。\n\n【技术路线】\n与多数竞品直接采用「视频切帧 + 图像模型」的路线不同，Claude 引入了专门的视频时序编码器，使得模型能够理解跨镜头的情节连续性。Anthropic 团队表示，这是他们首次在多模态方向超越 GPT-4 系列。",
    source: "Anthropic Research",
    sourceId: "anthropic-research",
    category: "研究进展",
    language: "zh",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["多模态", "大模型"],
  },
  {
    id: "demo-3",
    title: "机器之心：2026 年大模型行业白皮书发布",
    link: "https://jiqizhixin.com",
    summary:
      "机器之心发布 2026 年度行业白皮书，对全球主要大模型厂商进行盘点，并对开源与闭源路线的未来走向做出判断。",
    content:
      "机器之心联合多家机构发布《2026 大模型行业白皮书》。报告对过去一年全球大模型行业进行了系统性梳理，涵盖技术路线、商业模式、监管政策与资本市场四个维度。\n\n【市场格局】\n截至 2026 年 Q2，全球大模型市场规模突破 2800 亿美元，年增长 78%。头部五家厂商（OpenAI、Anthropic、Google、Meta、字节跳动）占据 85% 的市场份额。\n\n【技术趋势】\n报告指出三大趋势：端侧推理成熟化、Agent 编排工具标准化、模型规模增长边际递减。白皮书特别强调，单纯扩大模型参数带来的能力增益已明显放缓，2026 年起行业重心将从『规模竞赛』转向『推理效率』。\n\n【开源 vs 闭源】\n两者差距正在缩小。Llama 4、Qwen 3 等开源模型在主流基准测试上已接近 GPT-4 级水平，虽然在最复杂的数学/代码任务上仍有差距，但对 80% 的企业应用场景已足够。",
    source: "机器之心",
    sourceId: "jiqizhixin",
    category: "行业动态",
    language: "zh",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["行业动态", "大模型"],
  },
  {
    id: "demo-4",
    title: "arXiv 本周精选：多篇多模态论文集中发布",
    link: "https://arxiv.org",
    summary:
      "本周 arXiv 上集中涌现出多篇高质量多模态论文，涉及视频生成、3D 重建与跨模态检索等方向。",
    content:
      "本周 arXiv 上集中发布了多篇高质量多模态论文，其中以下三篇值得关注：\n\n1. 《VideoGen-3: High-Fidelity Video Generation with Text-to-Image Pretraining》 — 由 Google DeepMind 团队发布，采用文本到图像的预训练模型作为视频生成的起点，在 10 秒高清视频生成上取得 SOTA。\n2. 《NeuS-3D: Neural Surface Reconstruction from Sparse Views》 — 斯坦福团队提出在稀疏视角下进行高质量 3D 重建的新方法，仅需 4-8 张图片即可还原物体几何结构。\n3. 《CrossModal-Retrieval: A Unified Benchmark for Zero-Shot Cross-Language Retrieval》 — 系统性评估了 12 种主流多模态模型在跨语言检索任务上的表现，中文语料上 CLIP-Chinese 显著优于原版 CLIP。\n\n上述论文均已开源，代码、模型权重和 demo 均可在 GitHub 上获取。",
    source: "arXiv · AI",
    sourceId: "arxiv-ai",
    category: "论文",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY - 1000 * 60 * 60 * 4).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["论文", "多模态"],
  },
  {
    id: "demo-5",
    title: "Google 发布 Gemini Nano 3：端侧模型性能再升级",
    link: "https://ai.googleblog.com",
    summary:
      "Google 发布新一代端侧模型 Gemini Nano 3，在手机级设备上即可流畅运行复杂推理任务，主要面向隐私敏感场景。",
    content:
      "Google 在 I/O 开发者大会上正式发布新一代端侧模型 Gemini Nano 3。相比上一代，新模型在保持相同运行功耗的情况下，综合推理能力提升约 40%。\n\n【技术参数】\n参数量：约 3.5B\n支持上下文：128K tokens\n本地推理速度：Pixel 手机上约 120 tokens/s\n运行内存占用：< 800MB\n\n【核心卖点】\n『隐私优先』是本次发布的关键词。所有推理在设备本地完成，用户输入不经过任何云端服务器。企业场景下可部署到 Android Enterprise 设备，支持离线工作。\n\n【开发者工具】\nGoogle 同步更新了 Gemini Nano SDK，开发者可在 15 分钟内完成模型在自家 Android 应用中的集成。首个支持的应用包括 Gmail、Docs、Messages 及 Google Keep。",
    source: "Google AI Blog",
    sourceId: "google-ai",
    category: "产品发布",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY - 1000 * 60 * 60 * 12).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["大模型", "开源"],
  },
  {
    id: "demo-6",
    title: "MIT Technology Review：AI 芯片市场进入战国时代",
    link: "https://technologyreview.com",
    summary:
      "随着英伟达、AMD、Google TPU、苹果 M 系列以及国产芯片竞相发力，AI 芯片市场格局正在快速重塑。",
    content:
      "MIT Technology Review 发布长篇深度报道《The Chip Wars》，全景呈现当前全球 AI 芯片市场格局。\n\n【现状】\nNVIDIA 仍以 72% 的市场份额占据绝对主导，但挑战者正在涌现。AMD MI400 系列在 HPC 场景获得显著份额，Google TPU v6 在 Google Cloud 内部全面取代 GPU，AWS Trainium 正以每年 200% 的增速扩张。\n\n【国产力量】\n华为昇腾 910C 在国产大模型训练中已成为主流选择，字节跳动、百度等厂商均有大规模采购。寒武纪和海光在推理芯片市场也在发力。\n\n【价格战】\n2025-2026 年间，推理芯片价格下降了 45%，NVIDIA B200 的报价在部分云厂商中已低于 H200。这标志着 AI 算力从『卖方市场』逐步转向『买方市场』。",
    source: "MIT Technology Review",
    sourceId: "mit-technology-review-ai",
    category: "行业动态",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY - 1000 * 60 * 60 * 20).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["行业动态", "芯片"],
  },
  {
    id: "demo-7",
    title: "Meta 开源 Llama 4：首个支持 1T tokens 的开源模型",
    link: "https://ai.meta.com",
    summary:
      "Meta 正式开源 Llama 4，模型规模从 8B 到 400B，支持超长上下文和工具调用，允许商业使用。",
    content:
      "Meta 正式开源 Llama 4 家族模型，这是 Llama 系列的第四代大语言模型。本次发布包含多种尺寸，覆盖从边缘设备到云端训练的全场景。\n\n【模型规格】\nLlama 4-8B：端侧推理，支持商业使用\nLlama 4-70B：主流云端部署\nLlama 4-400B：旗舰级，具备工具调用与 Agent 能力\nLlama 4-Vision：多模态版本，支持图像+文本联合输入\n\n【超长上下文】\n全系列原生支持 1M tokens 上下文窗口，这是开源模型首次达到这一规模。在长文档问答和代码库理解任务上表现亮眼。\n\n【许可协议】\n采用 Llama 社区许可，允许商业使用（月活 7 亿以下免费），权重、推理代码和训练代码一并开源。Meta 同时发布了自蒸馏工具链，方便开发者在自有数据上继续微调。",
    source: "Meta AI",
    sourceId: "meta-ai",
    category: "开源",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY * 2 - 1000 * 60 * 60 * 3).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["开源", "大模型"],
  },
  {
    id: "demo-8",
    title: "斯坦福 HumanEval 榜单刷新：国产模型首次登顶",
    link: "https://stanford.edu",
    summary:
      "斯坦福大学发布最新 HumanEval 榜单，一款国产大模型以 94.2 的 pass@1 成绩首次登顶，超越 GPT-4 系列。",
    content:
      "斯坦福大学发布最新 HumanEval-X 编程基准测试榜单。一款来自中国的大模型『DeepSeek-Coder V4』首次登顶，超越 GPT-4 Turbo、Claude Opus 等传统顶级模型。\n\n【核心数据】\nDeepSeek-Coder V4 pass@1: 94.2\nGPT-4 Turbo pass@1: 92.8\nClaude Opus pass@1: 90.3\nLlama 4-400B pass@1: 88.1\n\n【技术亮点】\nDeepSeek 团队在论文中强调了两点创新：一是基于『代码执行反馈』的强化学习流程，让模型从『会写代码』进化到『会 Debug 代码』；二是引入了编译时错误的 multi-attempt 训练机制。\n\n【影响】\n这是国产大模型首次在公认权威代码基准上超越 GPT-4 系列，标志着国产模型在专业能力上已进入第一梯队。",
    source: "斯坦福 AI Lab",
    sourceId: "stanford-ailab",
    category: "研究进展",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY * 2 - 1000 * 60 * 60 * 8).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["研究进展", "大模型"],
  },
  {
    id: "demo-9",
    title: "字节跳动推出豆包新版本：支持原生 Agent 能力",
    link: "https://www.doubao.com",
    summary:
      "豆包大模型发布新版本，原生支持工具调用、Agent 编排与多步推理，开发者可零代码构建复杂应用。",
    content:
      "字节跳动旗下大模型产品「豆包」发布新版本，核心亮点是原生 Agent 能力的深度集成。\n\n【新增能力】\n工具调用（Tool Use）：内置 120+ 工具，包括网页浏览、代码执行、图像生成、文件解析等\nAgent 编排：支持可视化拖拽式工作流搭建，无需编写代码即可构建复杂 Agent\n多步推理：最长支持 200 步自主推理，在复杂任务上表现显著提升\n\n【开发者平台】\n豆包同步推出开放平台，开发者可自定义工具并发布到豆包生态。首个合作方包括飞书、今日头条和抖音，覆盖办公、资讯、短视频三大场景。\n\n【定价】\n个人用户免费版支持每日 50 次 Agent 调用；Pro 版（49 元/月）支持无限次调用并开放最新的 Doubao-Pro 权重。",
    source: "字节跳动",
    sourceId: "bytedance",
    category: "产品发布",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY * 3 - 1000 * 60 * 60 * 2).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["产品发布", "Agent"],
  },
  {
    id: "demo-10",
    title: "苹果发布 MM1.5-Pro：多模态理解能力全面提升",
    link: "https://machinelearning.apple.com",
    summary:
      "苹果最新多模态模型 MM1.5-Pro 在视觉理解与图文联合推理任务上表现亮眼，据称将集成到 iOS 30 中。",
    content:
      "苹果在 WWDC 上发布最新多模态模型 MM1.5-Pro，这是继 MM1 之后的重大版本升级。\n\n【主要能力】\n视觉问答：在 VQAv2 上达到 87.1 分\n图像生成理解：可分析并反向描述 SD/Midjourney 生成的图片\n文档解析：原生支持复杂 PDF、扫描件、手写笔记的结构化提取\n\n【性能对比】\n与 Google Gemini 1.5 Vision、OpenAI GPT-4o 相比，MM1.5-Pro 在 OCR、表格识别等结构化任务上领先 5-10 个百分点，在通用视觉问答上三者差距在误差范围内。\n\n【硬件部署】\nMM1.5-Pro 将集成到 iOS 30 和 macOS 15 中。得益于 Apple Silicon 的神经引擎优化，模型可在 M3/M4 芯片上以 50 tokens/s 的速度在本地运行推理，无需联网。\n\n苹果同时强调，Siri 的下一代版本将深度集成 MM1.5-Pro，预计 2026 年秋季上线。",
    source: "Apple ML",
    sourceId: "apple-ml",
    category: "产品发布",
    language: "zh",
    publishedAt: new Date(Date.now() - DAY * 3 - 1000 * 60 * 60 * 10).toISOString(),
    fetchedAt: new Date().toISOString(),
    tags: ["多模态", "产品发布"],
  },
];

export function getDemoNews(): NewsItem[] {
  return demoItems;
}
