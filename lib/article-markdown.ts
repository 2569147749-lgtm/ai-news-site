import * as cheerio from "cheerio";

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteUrl(value: string, baseUrl: string) {
  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

function escapeMarkdown(value: string) {
  return value.replace(/([\\`*_[\]<>])/g, "\\$1");
}

function isArticleImage(
  node: cheerio.Cheerio<any>,
  parent: cheerio.Cheerio<any>
) {
  const fingerprint = [
    node.attr("src"),
    node.attr("alt"),
    node.attr("class"),
    node.attr("id"),
    parent.attr("class"),
    parent.attr("id"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const excluded = /avatar|author|authorinfo|head|profile|user|logo|icon|qrcode|wechat|share|comment/;
  if (excluded.test(fingerprint)) return false;

  const width = Number(node.attr("width"));
  const height = Number(node.attr("height"));
  if (width && height && width < 180 && height < 180) {
    return false;
  }

  return true;
}

function isStyledHeading(
  node: cheerio.Cheerio<any>,
  text: string
) {
  if (text.length > 48) return false;
  const fingerprint = `${node.attr("class") || ""} ${node.attr("style") || ""}`.toLowerCase();
  const html = (node.html() || "").trim();
  return (
    /title|heading|subtitle|section|chapter|headline/.test(fingerprint) ||
    (/^<(?:strong|b)\b[^>]*>[\s\S]+<\/(?:strong|b)>$/.test(html) &&
      text.length >= 8)
  );
}

function inlineMarkdown(
  node: cheerio.Cheerio<any>,
  $: cheerio.CheerioAPI,
  baseUrl: string
): string {
  return node
    .contents()
    .map((_, child) => {
      if (child.type === "text") return child.data || "";

      const childNode = $(child);
      const tagName = "tagName" in child ? child.tagName.toLowerCase() : "";
      const value: string = inlineMarkdown(childNode, $, baseUrl).trim();
      if (!value) return "";

      if (tagName === "br") return "\n";
      if (tagName === "strong" || tagName === "b") return `**${value}**`;
      if (tagName === "em" || tagName === "i") return `*${value}*`;
      if (tagName === "code") return `\`${value.replace(/`/g, "\\`")}\``;
      if (tagName === "a") {
        const href = absoluteUrl(childNode.attr("href") || "", baseUrl);
        return href ? `[${value}](${href})` : value;
      }

      return value;
    })
    .get()
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function getMediaUrl(node: cheerio.Cheerio<any>, baseUrl: string) {
  const value =
    node.attr("src") ||
    node.attr("data-src") ||
    node.attr("data-original") ||
    node.attr("data-lazy-src") ||
    node.attr("data-url") ||
    "";
  return absoluteUrl(value, baseUrl);
}

function getMediaDimensions(node: cheerio.Cheerio<any>) {
  const parseDimension = (value?: string) => {
    const parsed = Number.parseInt(value || "", 10);
    return Number.isFinite(parsed) && parsed >= 180 && parsed <= 2400
      ? parsed
      : undefined;
  };
  const width = parseDimension(node.attr("width") || node.attr("data-width"));
  const height = parseDimension(node.attr("height") || node.attr("data-height"));
  return { width, height };
}

function markdownMedia(
  alt: string,
  url: string,
  type?: "audio" | "video",
  dimensions?: { width?: number; height?: number }
) {
  const imageMetadata =
    dimensions?.width || dimensions?.height
      ? `image;w=${dimensions.width || 0};h=${dimensions.height || 0}`
      : "";
  const title = type || imageMetadata;
  return `![${escapeMarkdown(alt)}](${url}${title ? ` "${title}"` : ""})`;
}

function tableToMarkdown(node: cheerio.Cheerio<any>, $: cheerio.CheerioAPI) {
  const rows: string[][] = [];
  node.find("tr").each((_, row) => {
    const cells: string[] = [];
    $(row)
      .find("th, td")
      .each((__, cell) => {
        cells.push(cleanText($(cell).text()).replace(/\|/g, "\\|"));
      });
    if (cells.length > 0) rows.push(cells);
  });

  if (rows.length === 0 || rows[0].length === 0) return "";
  const header = rows[0];
  const body = rows.slice(1);
  return [
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...body.map((row) => `| ${header.map((_, index) => row[index] || "").join(" | ")} |`),
  ].join("\n");
}

export function htmlToArticleMarkdown(html: string, baseUrl: string) {
  const $ = cheerio.load(html);
  const blocks: string[] = [];
  const seenText = new Set<string>();
  let previousImageAlt = "";

  $("h1, h2, h3, h4, p, blockquote, li, img, figure, video, audio, table, pre, hr").each((_, element) => {
    const node = $(element);
    if (node.parents("nav, header, footer, aside, script, style").length > 0) {
      return;
    }

    const tagName = element.tagName.toLowerCase();
    const text = cleanText(node.text());
    const formattedText = inlineMarkdown(node, $, baseUrl);

    if (tagName === "hr") {
      blocks.push("---");
      return;
    }

    if (tagName === "img") {
      if (node.parents("figure").length > 0) return;
      if (!isArticleImage(node, node.parent())) return;
      const src = getMediaUrl(node, baseUrl);
      if (!src) return;
      const alt = cleanText(node.attr("alt") || "");
      blocks.push(markdownMedia(alt, src, undefined, getMediaDimensions(node)));
      previousImageAlt = alt;
      return;
    }

    if (tagName === "figure") {
      const image = node.find("img").first();
      if (!isArticleImage(image, node)) return;
      const src = getMediaUrl(image, baseUrl);
      if (!src) return;
      const alt = cleanText(image.attr("alt") || node.find("figcaption").text());
      blocks.push(
        markdownMedia(alt, src, undefined, getMediaDimensions(image))
      );
      previousImageAlt = alt;
      const caption = cleanText(node.find("figcaption").text());
      if (caption) blocks.push(`*${escapeMarkdown(caption)}*`);
      return;
    }

    if (tagName === "video") {
      const source = node.attr("src") || node.find("source").first().attr("src") || "";
      const src = absoluteUrl(source, baseUrl);
      if (src) blocks.push(markdownMedia("视频", src, "video"));
      return;
    }

    if (tagName === "audio") {
      const source = node.attr("src") || node.find("source").first().attr("src") || "";
      const src = absoluteUrl(source, baseUrl);
      if (src) blocks.push(markdownMedia("音频", src, "audio"));
      return;
    }

    if (tagName === "table") {
      const table = tableToMarkdown(node, $);
      if (table) blocks.push(table);
      return;
    }

    if (tagName === "pre") {
      const code = node.find("code").first();
      const language = (code.attr("class") || "").match(/language-([\w-]+)/)?.[1] || "";
      const value = code.length ? code.text() : node.text();
      if (value.trim()) blocks.push(`\`\`\`${language}\n${value.trim()}\n\`\`\``);
      return;
    }

    if (!text || text.length < 2 || seenText.has(text)) return;
    if (
      tagName === "p" &&
      previousImageAlt.length >= 8 &&
      (text === previousImageAlt ||
        previousImageAlt.includes(text) ||
        text.includes(previousImageAlt))
    ) {
      previousImageAlt = "";
      return;
    }
    seenText.add(text);

    if (/^h[1-4]$/.test(tagName) || isStyledHeading(node, text)) {
      const level = Number(tagName.slice(1));
      const articleLevel = Number.isFinite(level)
        ? Math.min(Math.max(level + 1, 2), 3)
        : 2;
      blocks.push(`${"#".repeat(articleLevel)} ${text}`);
      return;
    }

    if (tagName === "blockquote") {
      if (node.find("p, li, ul, ol, h1, h2, h3, h4").length > 0) {
        return;
      }
      blocks.push(`> ${formattedText || text}`);
      return;
    }

    if (tagName === "li") {
      const marker = node.parent().is("ol") ? "1." : "-";
      blocks.push(`${marker} ${formattedText || text}`);
      return;
    }

    if (tagName === "p") {
      if (node.parent().is("li")) return;
      blocks.push(formattedText || text);
    }

    previousImageAlt = "";
  });

  return blocks.join("\n\n").trim();
}
