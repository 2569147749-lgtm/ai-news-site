import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("runs the production crawl once daily at 10:00 Asia/Shanghai", () => {
  const config = JSON.parse(
    readFileSync(join(process.cwd(), "vercel.json"), "utf8")
  ) as { crons: Array<{ path: string; schedule: string }> };

  assert.deepEqual(config.crons, [
    { path: "/api/crawl", schedule: "0 2 * * *" },
  ]);
});
