import type { NewsItem } from "./types";

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, "")
    .replace(/原标题|独家|快讯/g, "");
}

function levenshteinDistance(left: string, right: string) {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      const substitution = previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1);
      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        substitution
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
}

function areSimilarTitles(left: string, right: string) {
  if (left === right) return true;
  if (left.length < 12 || right.length < 12) return false;

  const distance = levenshteinDistance(left, right);
  const similarity = 1 - distance / Math.max(left.length, right.length);
  return similarity >= 0.88;
}

export function dedupeNewsItems(items: NewsItem[]): NewsItem[] {
  const seenLinks = new Set<string>();
  const retained: Array<{ item: NewsItem; normalizedTitle: string }> = [];

  for (const item of items) {
    if (seenLinks.has(item.link)) continue;
    seenLinks.add(item.link);

    const normalizedTitle = normalizeTitle(item.title);
    if (
      retained.some((candidate) =>
        areSimilarTitles(candidate.normalizedTitle, normalizedTitle)
      )
    ) {
      continue;
    }

    retained.push({ item, normalizedTitle });
  }

  return retained.map(({ item }) => item);
}
