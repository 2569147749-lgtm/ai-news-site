import { NextResponse } from "next/server";
import { getNewsWithFallback } from "@/lib/data";
import { getNewsPage } from "@/lib/news-pagination";
import { getTrendingNewsItems, searchNewsItems } from "@/lib/news-search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 100;
const SEARCH_PAGE_SIZE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const requestedPage = Number(searchParams.get("page") || "1");

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      {
        error: `Search query must be at most ${MAX_QUERY_LENGTH} characters`,
      },
      { status: 400 }
    );
  }

  const items = await getNewsWithFallback();
  const results = q
    ? searchNewsItems(items, q)
    : getTrendingNewsItems(items, new Date(), 20);

  const page = getNewsPage(results, requestedPage, SEARCH_PAGE_SIZE);

  return NextResponse.json({
    items: page.items.map((result) => result.item),
    total: results.length,
    query: q,
    kind: q ? "search" : "trending",
    page: page.page,
    totalPages: page.totalPages,
    hasMore: page.hasMore,
  });
}
