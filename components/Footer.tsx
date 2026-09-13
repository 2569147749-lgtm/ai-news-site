import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-sand-edge">
      <div className="site-shell flex flex-col gap-3 py-7 text-xs text-ink-sub sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} AI 日报 · 内容版权归原作者所有，本站仅作资讯索引与摘要。</p>
        <div className="flex gap-4">
          <FooterLink href="/rss.xml">RSS</FooterLink>
          <FooterLink href="/sitemap.xml">站点地图</FooterLink>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isExternal = href.startsWith("http");
  return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ink-main"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="hover:text-ink-main"
        >
          {children}
        </Link>
  );
}
