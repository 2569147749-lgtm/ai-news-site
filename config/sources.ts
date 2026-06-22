export interface RssSource {
  id: string;
  name: string;
  url: string;
  category: string;
  language: "zh" | "en";
  icon?: string;
}

export const rssSources: RssSource[] = [
  {
    id: "jiqizhixin",
    name: "机器之心",
    url: "https://www.jiqizhixin.com/rss",
    category: "行业动态",
    language: "zh",
  },
  {
    id: "leiphone-ai",
    name: "雷锋网 AI",
    url: "https://www.leiphone.com/feed/category/ai",
    category: "行业动态",
    language: "zh",
  },
  {
    id: "36kr-ai",
    name: "36氪 · AI",
    url: "https://36kr.com/feed/column/4",
    category: "产品发布",
    language: "zh",
  },
  {
    id: "qbitai",
    name: "量子位",
    url: "https://www.qbitai.com/feed",
    category: "行业动态",
    language: "zh",
  },
  {
    id: "infoq-zh-ai",
    name: "InfoQ 中文 · AI",
    url: "https://feed.infoq.com/ai/",
    category: "技术文章",
    language: "zh",
  },
  {
    id: "geekpark",
    name: "极客公园",
    url: "https://www.geekpark.net/rss",
    category: "产品发布",
    language: "zh",
  },
  {
    id: "huxiu-ai",
    name: "虎嗅 · AI",
    url: "https://www.huxiu.com/rss/channel/ai.xml",
    category: "行业动态",
    language: "zh",
  },
  {
    id: "techcrunch-ai",
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "产品发布",
    language: "en",
  },
  {
    id: "theverge-ai",
    name: "The Verge · AI",
    url: "https://www.theverge.com/rss/ai/index.xml",
    category: "产品发布",
    language: "en",
  },
  {
    id: "openai-blog",
    name: "OpenAI 官方博客",
    url: "https://openai.com/blog/rss",
    category: "官方动态",
    language: "en",
  },
  {
    id: "anthropic-research",
    name: "Anthropic Research",
    url: "https://www.anthropic.com/index.xml",
    category: "研究进展",
    language: "en",
  },
  {
    id: "google-ai",
    name: "Google AI Blog",
    url: "https://ai.googleblog.com/feeds/posts/default",
    category: "研究进展",
    language: "en",
  },
  {
    id: "mit-technology-review-ai",
    name: "MIT Technology Review · AI",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed/",
    category: "行业动态",
    language: "en",
  },
  {
    id: "arxiv-ai",
    name: "arXiv · AI",
    url: "http://export.arxiv.org/rss/cs.AI",
    category: "论文",
    language: "en",
  },
  {
    id: "meta-ai",
    name: "Meta AI Blog",
    url: "https://ai.facebook.com/blog/rss",
    category: "研究进展",
    language: "en",
  },
  {
    id: "deepmind",
    name: "Google DeepMind",
    url: "https://blog.google/technology/google-deepmind/feed/",
    category: "研究进展",
    language: "en",
  },
  {
    id: "huggingface-blog",
    name: "Hugging Face 博客",
    url: "https://huggingface.co/blog/feed.xml",
    category: "研究进展",
    language: "en",
  },
  {
    id: "wired-ai",
    name: "Wired · AI",
    url: "https://www.wired.com/feed/category/ai/latest/rss",
    category: "行业动态",
    language: "en",
  },
  {
    id: "arstechnica",
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "行业动态",
    language: "en",
  },
  {
    id: "venturebeat-ai",
    name: "VentureBeat · AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "行业动态",
    language: "en",
  },
  {
    id: "paperswithcode",
    name: "Papers with Code",
    url: "https://paperswithcode.com/feed",
    category: "论文",
    language: "en",
  },
];
