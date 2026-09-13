import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RouteProgress from "@/components/RouteProgress";

export const metadata: Metadata = {
  title: "AI 日报 · 中文 AI 资讯",
  description:
    "聚合极客公园、36氪、虎嗅、品玩、量子位与雷锋网的中文 AI 产品、行业和应用资讯。",
  keywords: ["AI新闻", "人工智能", "大模型", "智能体", "AI产品", "AI早报", "AI资讯"],
  authors: [{ name: "AI 日报" }],
  openGraph: {
    title: "AI 日报 · 中文 AI 资讯",
    description:
      "聚合中文 AI 产品、行业与应用资讯。",
    type: "website",
    locale: "zh_CN",
    siteName: "AI 日报",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 日报 · 中文 AI 资讯",
    description:
      "聚合中文 AI 产品、行业与应用资讯。",
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
        <a href="#main-content" className="skip-link">
          跳到正文
        </a>
        <RouteProgress />
        <Navbar />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
