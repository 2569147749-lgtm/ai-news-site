import assert from "node:assert/strict";
import test from "node:test";
import { getEnabledSources, rssSources } from "../config/sources";

test("uses the curated Chinese AI information sources", () => {
  assert.deepEqual(
    rssSources.map((source) => source.name),
    [
      "极客公园",
      "36氪 · AI",
      "虎嗅 · AI",
      "品玩 · 大模型内刊",
      "量子位",
      "雷锋网 AI",
      "36氪",
      "InfoQ",
      "爱范儿",
      "少数派",
      "IT之家",
    ]
  );
});

test("enables stable RSS sources and skips unreliable page sources", () => {
  assert.deepEqual(
    getEnabledSources().map((source) => source.name),
    [
      "极客公园",
      "虎嗅 · AI",
      "量子位",
      "雷锋网 AI",
      "36氪",
      "InfoQ",
      "爱范儿",
      "少数派",
      "IT之家",
    ]
  );
});
