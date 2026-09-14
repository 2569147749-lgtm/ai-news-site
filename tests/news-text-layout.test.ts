import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const styles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");
const articlePage = readFileSync(
  join(process.cwd(), "app/news/[slug]/page.tsx"),
  "utf8"
);

test("keeps news headings on natural line wrapping", () => {
  assert.match(styles, /h3\s*\{\s*text-wrap:\s*wrap;/);
});

test("lets the trending text use the full spotlight width", () => {
  assert.match(
    styles,
    /\.trending-carousel-content\s*\{[^}]*width:\s*100%;/s
  );
});

test("keeps the trending spotlight free of surrounding divider lines", () => {
  const trendingSection = styles.match(
    /\.trending-carousel\s*\{(?<rules>[^}]*)\}/s
  );

  assert.ok(trendingSection?.groups?.rules);
  assert.doesNotMatch(trendingSection.groups.rules, /border-(top|bottom)/);
});

test("uses one natural-wrap title style for every article source", () => {
  assert.match(articlePage, /className="article-title\b/);
  assert.doesNotMatch(articlePage, /textWrap:\s*"balance"/);
  assert.match(
    styles,
    /\.article-title\s*\{[^}]*text-wrap:\s*wrap;[^}]*\}/s
  );
});
