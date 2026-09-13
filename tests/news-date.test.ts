import assert from "node:assert/strict";
import test from "node:test";

async function loadDateHelpers(): Promise<{
  getShanghaiDate: (value: string | Date) => string;
  isValidDate: (value: string | Date) => boolean;
} | null> {
  try {
    return await import("../lib/news-date");
  } catch {
    return null;
  }
}

test("groups a UTC timestamp into its Asia/Shanghai calendar date", async () => {
  const helpers = await loadDateHelpers();
  assert.ok(helpers, "news date helpers must be available");

  assert.equal(
    helpers.getShanghaiDate("2026-09-10T18:30:00.000Z"),
    "2026-09-11"
  );
});

test("rejects invalid article timestamps before sorting or grouping", async () => {
  const helpers = await loadDateHelpers();
  assert.ok(helpers, "news date helpers must be available");

  assert.equal(helpers.isValidDate("not-a-date"), false);
  assert.equal(helpers.isValidDate("2026-09-10T18:30:00.000Z"), true);
});
