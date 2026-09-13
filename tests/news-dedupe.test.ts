import assert from "node:assert/strict";
import test from "node:test";
import { dedupeNewsItems } from "../lib/news-dedupe";
import type { NewsItem } from "../lib/types";

const makeItem = (id: string, title: string, link: string): NewsItem => ({
  id,
  title,
  link,
  summary: "同一条新闻的摘要内容",
  source: "测试来源",
  sourceId: "test",
  category: "AI 行业动态",
  language: "zh",
  publishedAt: "2026-09-12T08:00:00.000Z",
  fetchedAt: "2026-09-12T08:00:00.000Z",
  tags: [],
});

test("removes duplicate articles that have different links but the same title", () => {
  const items = dedupeNewsItems([
    makeItem("a", "宇树机器人加速进厂", "https://example.com/a"),
    makeItem("b", "宇树机器人加速进厂", "https://example.com/b"),
  ]);

  assert.equal(items.length, 1);
  assert.equal(items[0].id, "a");
});

test("removes near-duplicate titles from syndicated coverage", () => {
  const items = dedupeNewsItems([
    makeItem("a", "宇树机器人加速进厂，产业链迎来新机会", "https://example.com/a"),
    makeItem("b", "宇树机器人加速进厂，产业链迎来新机遇", "https://example.com/b"),
  ]);

  assert.equal(items.length, 1);
});
