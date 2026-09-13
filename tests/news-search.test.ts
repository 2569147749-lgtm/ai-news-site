import assert from "node:assert/strict";
import test from "node:test";
import {
  getHomepageHighlights,
  getTrendingNewsItems,
  searchNewsItems,
} from "../lib/news-search";
import type { NewsItem } from "../lib/types";

function item(overrides: Partial<NewsItem>): NewsItem {
  return {
    id: "test",
    title: "默认标题",
    link: "https://example.com/article",
    summary: "默认摘要",
    source: "量子位",
    sourceId: "qbitai",
    category: "AI 行业动态",
    language: "zh",
    publishedAt: "2026-09-12T08:00:00.000Z",
    fetchedAt: "2026-09-12T08:00:00.000Z",
    tags: [],
    ...overrides,
  };
}

test("searches exact phrases first, then includes broad keyword matches", () => {
  const results = searchNewsItems(
    [
      item({
        id: "exact",
        title: "智能体工作流进入企业办公",
        summary: "产品更新",
      }),
      item({
        id: "broad",
        title: "智能体正在改变办公流程",
        summary: "工作流落地",
      }),
      item({ id: "irrelevant", title: "图像模型更新", summary: "与搜索无关" }),
    ],
    "智能体工作流",
    new Date("2026-09-12T10:00:00.000Z")
  );

  assert.deepEqual(results.map((result) => result.item.id), ["exact", "broad"]);
});

test("returns the twenty most timely and high-signal stories for an empty search", () => {
  const trending = getTrendingNewsItems(
    [
      item({
        id: "older",
        title: "行业观察",
        publishedAt: "2026-09-02T08:00:00.000Z",
      }),
      item({
        id: "new-model",
        title: "新模型发布，智能体能力升级",
        tags: ["大模型", "产品发布"],
        publishedAt: "2026-09-12T09:00:00.000Z",
      }),
      ...Array.from({ length: 24 }, (_, index) =>
        item({
          id: `story-${index}`,
          title: `AI 行业动态 ${index}`,
          publishedAt: `2026-09-${String(11 - Math.floor(index / 4)).padStart(2, "0")}T08:00:00.000Z`,
        })
      ),
    ],
    new Date("2026-09-12T10:00:00.000Z"),
    20
  );

  assert.equal(trending.length, 20);
  assert.equal(trending[0].item.id, "new-model");
  assert.equal(trending.some((result) => result.item.id === "older"), false);
});

test("selects recent high-signal homepage highlights from distinct sources first", () => {
  const highlights = getHomepageHighlights(
    [
      item({
        id: "first-qbitai",
        source: "量子位",
        title: "新模型发布，智能体能力升级",
        publishedAt: "2026-09-12T09:00:00.000Z",
      }),
      item({
        id: "second-qbitai",
        source: "量子位",
        title: "大模型产品发布",
        publishedAt: "2026-09-12T08:30:00.000Z",
      }),
      item({
        id: "infoq",
        source: "InfoQ",
        title: "企业智能体正式上线",
        publishedAt: "2026-09-12T08:00:00.000Z",
      }),
      item({
        id: "36kr",
        source: "36氪",
        title: "AI 公司推出新产品",
        publishedAt: "2026-09-12T07:30:00.000Z",
      }),
    ],
    new Date("2026-09-12T10:00:00.000Z"),
    3
  );

  assert.deepEqual(
    highlights.map((result) => result.item.id),
    ["first-qbitai", "infoq", "36kr"]
  );
});
