export interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  language: "zh" | "en";
  type: "rss" | "page";
  enabled?: boolean;
  articlePathPrefix?: string;
  keywords?: string[];
}

const aiKeywords = [
  "ai",
  "人工智能",
  "大模型",
  "模型",
  "智能体",
  "agent",
  "生成式",
  "aigc",
  "chatgpt",
  "deepseek",
  "豆包",
  "千问",
  "机器人",
  "具身智能",
];

export const rssSources: RssSource[] = [
  {
    id: "geekpark-ai",
    name: "极客公园",
    url: "https://www.geekpark.net/rss",
    category: "AI 产品与趋势",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "36kr-ai",
    name: "36氪 · AI",
    url: "https://36kr.com/motif/414",
    category: "AI 产品与商业",
    language: "zh",
    type: "page",
    enabled: false,
    articlePathPrefix: "/p/",
  },
  {
    id: "huxiu-ai",
    name: "虎嗅 · AI",
    url: "https://rss.huxiu.com/",
    category: "AI 行业动态",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "pingwest-ai",
    name: "品玩 · 大模型内刊",
    url: "https://www.pingwest.com/tag/gpt",
    category: "AI 产品与体验",
    language: "zh",
    type: "page",
    enabled: false,
    articlePathPrefix: "/a/",
  },
  {
    id: "qbitai",
    name: "量子位",
    url: "https://www.qbitai.com/feed",
    category: "AI 行业动态",
    language: "zh",
    type: "rss",
  },
  {
    id: "leiphone-ai",
    name: "雷锋网 AI",
    url: "https://www.leiphone.com/feed",
    category: "AI 应用与产业",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "36kr",
    name: "36氪",
    url: "https://www.36kr.com/feed",
    category: "AI 产品与商业",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "infoq",
    name: "InfoQ",
    url: "https://www.infoq.cn/feed",
    category: "AI 企业实践",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "ifanr",
    name: "爱范儿",
    url: "https://www.ifanr.com/feed",
    category: "AI 产品与体验",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "sspai",
    name: "少数派",
    url: "https://sspai.com/feed",
    category: "AI 工具与效率",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
  {
    id: "ithome",
    name: "IT之家",
    url: "https://www.ithome.com/rss/",
    category: "AI 行业动态",
    language: "zh",
    type: "rss",
    keywords: aiKeywords,
  },
];

export function getEnabledSources() {
  return rssSources.filter((source) => source.enabled !== false);
}
