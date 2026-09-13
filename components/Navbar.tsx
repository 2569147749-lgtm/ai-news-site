import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <div className="navbar-glass">
        <div className="site-shell flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="AI 日报首页">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-amber font-black text-ink-main">
              A
            </span>
            <span className="text-base font-extrabold tracking-tight">AI 日报</span>
          </Link>

          <nav className="hidden items-center gap-1 text-sm md:flex">
            <NavLink href="/">首页</NavLink>
            <NavLink href="/search">搜索</NavLink>
          </nav>

          <div aria-hidden="true" className="hidden w-7 sm:block" />
        </div>

        <nav className="site-shell flex gap-1 overflow-x-auto border-t border-sand-edge py-2 text-xs md:hidden">
          <NavLink href="/" mobile>首页</NavLink>
          <NavLink href="/search" mobile>搜索</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children, mobile }: { href: string; children: React.ReactNode; mobile?: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded px-2.5 py-1.5 text-ink-sub transition-colors hover:bg-sand-soft hover:text-ink-main ${mobile ? "text-xs" : "text-sm"}`}
    >
      {children}
    </Link>
  );
}
