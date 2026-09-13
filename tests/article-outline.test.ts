import assert from "node:assert/strict";
import test from "node:test";
import { getArticleOutline } from "../lib/article-outline";

test("builds anchorable outline entries from markdown headings", () => {
  assert.deepEqual(
    getArticleOutline("# 主标题\n\n正文\n\n## 第一节\n\n### 细节"),
    [
      { depth: 1, text: "主标题", id: "主标题" },
      { depth: 2, text: "第一节", id: "第一节" },
      { depth: 3, text: "细节", id: "细节" },
    ]
  );
});

test("creates stable unique ids for repeated headings", () => {
  assert.deepEqual(
    getArticleOutline("## 观点\n\n## 观点"),
    [
      { depth: 2, text: "观点", id: "观点" },
      { depth: 2, text: "观点", id: "观点-2" },
    ]
  );
});
