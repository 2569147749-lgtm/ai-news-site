const entityMap: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

function decodeHtmlEntities(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity) => {
    const key = entity.slice(1, -1).toLowerCase();

    if (key.startsWith("#x")) {
      return String.fromCodePoint(parseInt(key.slice(2), 16));
    }

    if (key.startsWith("#")) {
      return String.fromCodePoint(parseInt(key.slice(1), 10));
    }

    return entityMap[key] ?? entity;
  });
}

export function cleanNewsSummary(value: string): string {
  const summary = decodeHtmlEntities(value).replace(/\s+/g, " ").trim();

  return /^点击查看原文[>＞]?$/u.test(summary) ? "" : summary;
}
