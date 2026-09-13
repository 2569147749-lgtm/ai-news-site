import Link from "next/link";

export const metadata = {
  title: "404 找不到页面 · AI 日报",
  description: "抱歉，该页面不存在或链接已失效。",
};

export default function NotFound() {
  return (
    <div className="site-shell flex min-h-[65vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <p className="section-kicker">404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-ink-main md:text-4xl">
          抱歉，找不到这页内容
        </h1>
        <p className="mt-4 text-sm leading-7 text-ink-sub">
          可能链接已失效，或这篇资讯暂时未被收录。
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            返回首页
          </Link>
          <Link href="/search" className="btn-secondary">
            搜索资讯
          </Link>
        </div>
      </div>
    </div>
  );
}
