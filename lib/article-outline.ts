export interface ArticleOutlineItem {
  depth: number;
  text: string;
  id: string;
}

function toHeadingText(value: string) {
  return value
    .replace(/[*_`[\]]/g, "")
    .replace(/\((?:https?:\/\/)?[^)]*\)/g, "")
    .trim();
}

export function getArticleOutline(markdown: string): ArticleOutlineItem[] {
  const counts = new Map<string, number>();

  return markdown
    .split("\n")
    .flatMap((line) => {
      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (!match) return [];

      const text = toHeadingText(match[2]);
      if (!text) return [];
      const count = (counts.get(text) || 0) + 1;
      counts.set(text, count);

      return [{
        depth: match[1].length,
        text,
        id: count === 1 ? text : `${text}-${count}`,
      }];
    });
}
