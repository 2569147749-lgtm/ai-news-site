export interface NewsItem {
  id: string;
  title: string;
  link: string;
  summary: string;
  content?: string;
  source: string;
  sourceId: string;
  category: string;
  language: "zh" | "en";
  publishedAt: string;
  fetchedAt: string;
  tags: string[];
}

export interface DailyReport {
  date: string;
  items: NewsItem[];
  generatedAt: string;
}

export interface NewsCardProps {
  item: NewsItem;
  featured?: boolean;
  showTags?: boolean;
}

export interface SiteConfig {
  siteName: string;
  siteUrl: string;
  description: string;
}
