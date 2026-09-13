import { NextRequest } from "next/server";
import { isAllowedMediaUrl } from "@/lib/media-url";

const MEDIA_TIMEOUT_MS = 10_000;
const MAX_MEDIA_BYTES = 12 * 1024 * 1024;

export async function GET(request: NextRequest) {
  const mediaUrl = request.nextUrl.searchParams.get("url") || "";
  const referer = request.nextUrl.searchParams.get("referer") || "";

  if (!isAllowedMediaUrl(mediaUrl)) {
    return new Response("Unsupported media source", { status: 400 });
  }

  try {
    const response = await fetch(mediaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIDailyMedia/1.0; +https://example.com)",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        ...(referer ? { Referer: referer } : {}),
      },
      signal: AbortSignal.timeout(MEDIA_TIMEOUT_MS),
      next: { revalidate: 86400 },
    });

    const contentType = response.headers.get("content-type") || "";
    const contentLength = Number(response.headers.get("content-length") || "0");
    if (
      !response.ok ||
      !/^image\/|^video\/|^audio\//.test(contentType) ||
      (contentLength && contentLength > MAX_MEDIA_BYTES)
    ) {
      return new Response("Media unavailable", { status: 404 });
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new Response("Media unavailable", { status: 404 });
  }
}
