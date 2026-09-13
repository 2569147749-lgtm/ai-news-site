import assert from "node:assert/strict";
import test from "node:test";
import { cleanNewsSummary } from "../lib/news-summary";

test("removes publisher placeholder summaries", () => {
  assert.equal(cleanNewsSummary("点击查看原文>"), "");
});

test("decodes HTML entities in RSS summaries", () => {
  assert.equal(
    cleanNewsSummary("Read, Don&#39;t Write: AI&nbsp;评测"),
    "Read, Don't Write: AI 评测"
  );
});
