import type { NewsItem } from "./types";

const MARKDOWN_IMAGE_PATTERN =
  /!\[[^\]]*]\((https?:\/\/[^\s)]+)(?:\s+"([^"]+)")?\)/g;

export function getFirstArticleImage(content?: string) {
  if (!content) return "";

  for (const match of content.matchAll(MARKDOWN_IMAGE_PATTERN)) {
    const url = match[1];
    const mediaType = match[2];
    if (mediaType === "video" || mediaType === "audio") continue;
    return url;
  }

  return "";
}

export function prioritizeNewsWithImages(items: NewsItem[]) {
  return [
    ...items.filter((item) => Boolean(getFirstArticleImage(item.content))),
    ...items.filter((item) => !getFirstArticleImage(item.content)),
  ];
}
