import { NextResponse } from "next/server";
import { extractArticle } from "@/lib/article-extractor";

export const runtime = "nodejs";

/**
 * GET /api/full-article?url=<encoded-url>
 * 返回 { title, content, source } 或 { error: string }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "缺少 url 参数" },
      { status: 400 }
    );
  }

  try {
    const decoded = decodeURIComponent(url);
    const result = await extractArticle(decoded);

    if (!result) {
      return NextResponse.json(
        { error: "无法提取该文章内容" },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
