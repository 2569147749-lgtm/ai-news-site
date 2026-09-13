import assert from "node:assert/strict";
import test from "node:test";
import { getFirstArticleImage, prioritizeNewsWithImages } from "../lib/news-media";
import type { NewsItem } from "../lib/types";

test("returns the first article image URL from structured markdown", () => {
  const image = getFirstArticleImage(`
    开场正文。

    ![产品首图](https://cdn.example.com/cover.webp "image;w=1200;h=630")

    ![第二张图](https://cdn.example.com/second.png)
  `);

  assert.equal(image, "https://cdn.example.com/cover.webp");
});

test("does not treat video or audio media as a hero image", () => {
  assert.equal(
    getFirstArticleImage(
      '![视频](https://cdn.example.com/demo.mp4 "video")\n\n![配图](https://cdn.example.com/cover.jpg)'
    ),
    "https://cdn.example.com/cover.jpg"
  );
});

test("prioritizes news with article images without changing the remaining order", () => {
  const items = [
    { id: "text-first", content: "" },
    { id: "image-second", content: "![封面](https://cdn.example.com/cover.jpg)" },
    { id: "text-third", content: "" },
    { id: "image-fourth", content: "![封面](https://cdn.example.com/cover.png)" },
  ] as NewsItem[];

  assert.deepEqual(
    prioritizeNewsWithImages(items).map((item) => item.id),
    ["image-second", "image-fourth", "text-first", "text-third"]
  );
});
