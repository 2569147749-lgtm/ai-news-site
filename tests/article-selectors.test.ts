import assert from "node:assert/strict";
import test from "node:test";
import { getSourceArticleSelectors } from "../lib/article-extractor";

test("uses source-specific article selectors before generic extraction", () => {
  assert.deepEqual(
    getSourceArticleSelectors("https://www.qbitai.com/2026/09/article.html"),
    [".article-content", ".post-content", ".content"]
  );
  assert.deepEqual(
    getSourceArticleSelectors("https://www.huxiu.com/article/123.html"),
    [".article-content", "[class*='article-content']", "article"]
  );
});
