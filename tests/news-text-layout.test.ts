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

test("uses natural wrapping for article detail titles", () => {
  assert.doesNotMatch(articlePage, /textWrap:\s*"balance"/);
  assert.match(articlePage, /textWrap:\s*"wrap"/);
  assert.doesNotMatch(
    articlePage,
    /className="site-shell max-w-4xl py-8 md:py-12"/
  );
});
