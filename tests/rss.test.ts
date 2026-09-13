import assert from "node:assert/strict";
import test from "node:test";
import { RSS_USER_AGENT } from "../lib/rss";

test("uses a browser-compatible user agent for publishers that block bot feeds", () => {
  assert.match(RSS_USER_AGENT, /^Mozilla\/5\.0/);
});
