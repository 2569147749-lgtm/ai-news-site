"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pathname) return;

    setVisible(true);
    setProgress(10);

    const t1 = setTimeout(() => setProgress(35), 100);
    const t2 = setTimeout(() => setProgress(65), 300);
    const t3 = setTimeout(() => setProgress(85), 700);
    const t4 = setTimeout(() => setProgress(100), 1200);
    const t5 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent pointer-events-none">
      <div
        className="route-progress-bar h-full bg-amber transition-[width,opacity] duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress < 100 ? 1 : 0.3 }}
      />
    </div>
  );
}

export default function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
