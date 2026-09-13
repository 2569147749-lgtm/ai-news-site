import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const styles = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

test("keeps news headings on natural line wrapping", () => {
  assert.match(styles, /h3\s*\{\s*text-wrap:\s*wrap;/);
});

test("lets the trending text use the full spotlight width", () => {
  assert.match(
    styles,
    /\.trending-carousel-content\s*\{[^}]*width:\s*100%;/s
  );
});
