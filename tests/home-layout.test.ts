import assert from "node:assert/strict";
import test from "node:test";
import { newsContentClassName } from "../lib/home-layout";

test("uses the full site content width for the homepage news stream", () => {
  assert.equal(newsContentClassName, "w-full");
});
