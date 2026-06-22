import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar-glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Aura Daily - 回到首页">
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden border border-amber-400/40 shadow-sm shadow-amber-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-cyan-500 group-hover:scale-110 transition-transform"></div>
              <svg className="relative w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 L4 7 L4 17 L12 22 L20 17 L20 7 Z" opacity="0.4"/>
                <path d="M12 2 L12 22 M4 7 L20 17 M20 7 L4 17"/>
                <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/>
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-amber-900 tracking-tight"><span translate="no">AURA · DAILY</span></span>
              <span className="text-terminal-xs font-mono text-cyan-700 tracking-[0.2em]">AI · NEWS · GRID</span>
            </div>
          </Link>

          {/* MENU */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/news">资讯流</NavLink>
            <NavLink href="/daily">每日早报</NavLink>
            <NavLink href="/search">搜索</NavLink>
            <NavLink href="/about">关于</NavLink>
          </nav>

          {/* LIVE + CTA */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-300 bg-green-50 text-xs font-mono">
              <span className="pulse-dot"></span>
              <span className="text-green-700">LIVE</span>
              <span className="text-amber-900/30">·</span>
              <span className="text-amber-800/80">每小时更新</span>
            </div>
            <Link href="/daily" className="btn-neon !px-4 !py-2 !text-xs whitespace-nowrap">
              今日早报 →
            </Link>
          </div>
        </div>

        {/* 移动端导航 */}
        <nav className="md:hidden border-t border-sand-edge px-4 py-2 flex items-center gap-1 overflow-x-auto text-xs [touch-action:manipulation]">
          <NavLink href="/" mobile>首页</NavLink>
          <NavLink href="/news" mobile>资讯</NavLink>
          <NavLink href="/daily" mobile>早报</NavLink>
          <NavLink href="/search" mobile>搜索</NavLink>
          <NavLink href="/about" mobile>关于</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children, mobile }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3.5 py-1.5 rounded-full text-amber-900 hover:text-amber-700 hover:bg-amber-100 active:scale-95 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${mobile ? "text-xs" : "text-sm"}`}
    >
      {children}
    </Link>
  );
}
