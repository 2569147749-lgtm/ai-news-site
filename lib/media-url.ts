const ALLOWED_MEDIA_HOST_SUFFIXES = [
  "huxiucdn.com",
  "huxiu.com",
  "leiphone.com",
  "qbitai.com",
  "geekpark.net",
  "36kr.com",
  "pingwest.com",
  "byteimg.com",
  "geekbang.org",
  "ifanr.com",
  "sspai.com",
  "ithome.com",
  "toutiaoimg.com",
];

export function isAllowedMediaUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const hostname = url.hostname.toLowerCase();
    return ALLOWED_MEDIA_HOST_SUFFIXES.some(
      (suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

export function buildMediaProxyUrl(url: string, referer: string) {
  if (!isAllowedMediaUrl(url)) return "";

  const params = new URLSearchParams({ url });
  if (referer.startsWith("https://") || referer.startsWith("http://")) {
    params.set("referer", referer);
  }
  return `/api/media?${params.toString()}`;
}
