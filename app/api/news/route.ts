import { NextResponse } from "next/server";
import { getNewsWithFallback } from "@/lib/data";
import { getNewsBatch } from "@/lib/news-pagination";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEWS_BATCH_SIZE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedPage = Number(searchParams.get("page") || "1");
  const items = await getNewsWithFallback();
  const page = getNewsBatch(items.slice(3), requestedPage, NEWS_BATCH_SIZE);

  return NextResponse.json({
    items: page.items,
    page: page.page,
    hasMore: page.hasMore,
  });
}
