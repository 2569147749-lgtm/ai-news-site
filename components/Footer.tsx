import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20">
      <div className="border-t border-sand-edge bg-sand-card">
        <div className="max-w-6xl mx-auto px-4 py-14 relative">
          <div className="relative grid md:grid-cols-4 gap-10">
            {/* LOGO + 描述 */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-amber-400/40 shadow-sm shadow-amber-500/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500"></div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold text-amber-900 text-sm"><span translate="no">AURA</span></span>
                  <span className="text-sm font-bold text-cyan-700"><span translate="no">DAILY</span></span>
                </div>
                <span className="text-terminal-xs font-mono text-ink-sub ml-1">// v1.0.0</span>
              </div>
              <p className="text-sm text-ink-sub leading-relaxed max-w-md">
                自动聚合全球 AI 领域的新闻、论文与产品动态，每天为你生成一份值得阅读的早报 —
                <span className="text-amber-700"> 未来的资讯入口</span>。
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-mono text-ink-sub">
                <span className="pulse-dot"></span>
                <span className="text-green-700">SERVICE ONLINE · GRID ACTIVE</span>
              </div>
            </div>

            {/* PRODUCT */}
            <div>
              <div className="text-xs font-mono font-semibold tracking-[0.2em] text-amber-700 mb-4">
                // PRODUCT
              </div>
              <ul className="space-y-2.5 text-sm">
                <FooterLink href="/news">全部资讯</FooterLink>
                <FooterLink href="/daily">每日早报</FooterLink>
                <FooterLink href="/search">站内搜索</FooterLink>
                <FooterLink href="/about">关于</FooterLink>
              </ul>
            </div>

            {/* DEVELOPER */}
            <div>
              <div className="text-xs font-mono font-semibold tracking-[0.2em] text-cyan-700 mb-4">
                // DEVELOPER
              </div>
              <ul className="space-y-2.5 text-sm">
                <FooterLink href="/rss.xml">RSS Feed</FooterLink>
                <FooterLink href="https://vercel.com">Deploy on Vercel</FooterLink>
                <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
              </ul>
            </div>
          </div>

          {/* 底部版权 */}
          <div className="relative mt-14 pt-6 border-t border-sand-edge flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-xs font-mono text-ink-sub">
              © {year} AURA · DAILY — 内容版权归原作者所有 · 本站仅做聚合与索引
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-sub">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 shadow-sm"></span>
              <span>POWERED BY RSS + GRID</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  return (
    <li>
      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-sub hover:text-amber-700 transition-colors inline-flex items-center gap-1.5 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          <span className="text-cyan-600">›</span>
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="text-ink-sub hover:text-amber-700 transition-colors inline-flex items-center gap-1.5 font-mono text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
        >
          <span className="text-cyan-600">›</span>
          {children}
        </Link>
      )}
    </li>
  );
}
