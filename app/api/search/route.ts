import { NextResponse } from "next/server";
import { searchNews } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  const items = await searchNews(q);

  return NextResponse.json({
    items: items.slice(0, 50),
    total: items.length,
    query: q,
  });
}
