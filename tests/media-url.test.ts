import assert from "node:assert/strict";
import test from "node:test";
import { buildMediaProxyUrl, isAllowedMediaUrl } from "../lib/media-url";

test("builds a same-origin proxy URL for an approved article image", () => {
  const url = "https://img.huxiucdn.com/article/example.png";
  const referer = "https://www.huxiu.com/article/1.html";

  assert.equal(
    buildMediaProxyUrl(url, referer),
    "/api/media?url=https%3A%2F%2Fimg.huxiucdn.com%2Farticle%2Fexample.png&referer=https%3A%2F%2Fwww.huxiu.com%2Farticle%2F1.html"
  );
});

test("allows curated source media and rejects local or unapproved hosts", () => {
  assert.equal(
    isAllowedMediaUrl("https://static.leiphone.com/uploads/image.jpg"),
    true
  );
  assert.equal(
    isAllowedMediaUrl(
      "https://static001.geekbang.org/infoq/74/example-article-image.png"
    ),
    true
  );
  assert.equal(isAllowedMediaUrl("https://s3.ifanr.com/example.jpg"), true);
  assert.equal(
    isAllowedMediaUrl("https://cdnfile.sspai.com/example.jpg"),
    true
  );
  assert.equal(isAllowedMediaUrl("https://img.ithome.com/example.jpg"), true);
  assert.equal(
    isAllowedMediaUrl("https://p3-sign.toutiaoimg.com/example.jpg"),
    true
  );
  assert.equal(isAllowedMediaUrl("http://127.0.0.1:3000/admin"), false);
  assert.equal(isAllowedMediaUrl("https://example.invalid/image.jpg"), false);
});
