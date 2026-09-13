import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeNewsId,
  NEWS_RETENTION_LIMIT,
  retainNewsItems,
} from "../lib/news-cache";
import type { NewsItem } from "../lib/types";

const makeItem = (id: string): NewsItem => ({
  id,
  title: id,
  link: `https://example.com/${id}`,
  summary: "",
  source: "测试来源",
  sourceId: "test",
  category: "测试",
  language: "zh",
  publishedAt: "2026-09-12T08:00:00.000Z",
  fetchedAt: "2026-09-12T08:00:00.000Z",
  tags: [],
});

test("retains recently visible articles across a partial refresh", () => {
  const retained = retainNewsItems(
    [makeItem("new")],
    [makeItem("previous")],
    200
  );

  assert.deepEqual(
    retained.map((item) => item.id),
    ["new", "previous"]
  );
});

test("retains the latest five hundred articles across a partial refresh", () => {
  const existing = Array.from({ length: 500 }, (_, index) => ({
    ...makeItem(`existing-${index}`),
    publishedAt: new Date(
      Date.UTC(2026, 8, 12, 8, 0, 0) - index * 60_000
    ).toISOString(),
  }));
  const retained = retainNewsItems([makeItem("fresh")], existing, 500);

  assert.equal(retained.length, 500);
  assert.equal(retained[0].id, "fresh");
  assert.equal(retained.at(-1)?.id, "existing-498");
});

test("uses a five hundred article retention limit", () => {
  assert.equal(NEWS_RETENTION_LIMIT, 500);
});

test("decodes a percent-encoded news route id before lookup", () => {
  assert.equal(
    decodeNewsId("huxiu-ai-title%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD"),
    "huxiu-ai-title人工智能"
  );
});

test("deduplicates the retained cache after a source changes an article id", () => {
  const newer = {
    ...makeItem("infoq-new-id"),
    title: "Read, Don't Write: 重塑大模型评价体系",
    link: "https://www.infoq.cn/article/example?utm_source=rss",
    publishedAt: "2026-09-13T10:00:00.000Z",
  };
  const older = {
    ...newer,
    id: "infoq-old-id",
    link: "https://www.infoq.cn/article/example",
    fetchedAt: "2026-09-13T09:00:00.000Z",
  };

  const retained = retainNewsItems([newer], [older], NEWS_RETENTION_LIMIT);

  assert.equal(retained.length, 1);
  assert.equal(retained[0].id, "infoq-new-id");
});
