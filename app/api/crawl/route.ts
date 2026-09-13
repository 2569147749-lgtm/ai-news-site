import { NextResponse } from "next/server";
import { refreshNews } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cronSecret =
      typeof process !== "undefined" ? process.env?.CRON_SECRET : undefined;

    if (process.env.NODE_ENV === "production" && !cronSecret) {
      return NextResponse.json(
        { ok: false, error: "CRON_SECRET is not configured" },
        { status: 503 }
      );
    }

    if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await refreshNews();

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      total: result.total,
      saved: result.saved,
      fallback: result.fallback,
      perSource: result.perSource,
      items: result.items,
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
