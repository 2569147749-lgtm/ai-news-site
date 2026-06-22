import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Aura Daily · AI 每日资讯",
  description:
    "自动聚合全球 AI 领域的新闻、论文、产品发布与官方动态，每日整理 AI 早报，5 分钟掌握行业动态。",
  keywords: ["AI新闻", "人工智能", "GPT", "Claude", "大模型", "AI早报", "AI资讯", "技术资讯"],
  authors: [{ name: "Aura Daily" }],
  openGraph: {
    title: "Aura Daily · AI 每日资讯",
    description:
      "全球 AI 动态一站聚合，每日早报快速掌握行业最新进展",
    type: "website",
    locale: "zh_CN",
    siteName: "Aura Daily",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aura Daily · AI 每日资讯",
    description:
      "每日整理 AI 行业动态，5 分钟了解 AI 世界",
  },
};

export const viewport = {
  themeColor: "#fffbf2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
