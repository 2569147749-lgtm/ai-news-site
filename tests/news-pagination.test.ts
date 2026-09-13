import assert from "node:assert/strict";
import test from "node:test";
import { getNewsBatch, getNewsPage } from "../lib/news-pagination";

test("returns a bounded page and indicates when more items exist", () => {
  const page = getNewsPage(
    Array.from({ length: 45 }, (_, index) => index + 1),
    2,
    20
  );

  assert.deepEqual(page.items, Array.from({ length: 20 }, (_, index) => index + 21));
  assert.equal(page.page, 2);
  assert.equal(page.hasMore, true);
  assert.equal(page.totalPages, 3);
});

test("normalizes invalid page values to the first page", () => {
  const page = getNewsPage([1, 2, 3], Number.NaN, 20);

  assert.deepEqual(page.items, [1, 2, 3]);
  assert.equal(page.page, 1);
  assert.equal(page.hasMore, false);
});

test("returns only the next batch for incremental loading", () => {
  const batch = getNewsBatch(
    Array.from({ length: 45 }, (_, index) => index + 1),
    2,
    20
  );

  assert.deepEqual(batch.items, Array.from({ length: 20 }, (_, index) => index + 21));
  assert.equal(batch.hasMore, true);
});
