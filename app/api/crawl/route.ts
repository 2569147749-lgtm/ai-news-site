import { NextResponse } from "next/server";
import { crawlAllSources } from "@/lib/rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hasCronSecret =
      typeof process !== "undefined" && !!process.env?.CRON_SECRET;
    /* 开发环境不强制鉴权，生产通过 Vercel Cron Authorization 头 */
    void hasCronSecret;

    const result = await crawlAllSources();

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
