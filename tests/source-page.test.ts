import assert from "node:assert/strict";
import test from "node:test";

test("converts a source page article card into a news item", async () => {
  const { parseSourcePageHtml } = await import("../lib/source-page");

  const items = parseSourcePageHtml(
    `
      <article>
        <a href="/p/123">办公 Agent 如何进入真实工作流</a>
        <time datetime="2026-09-12T08:00:00+08:00">2026-09-12</time>
        <p>从产品体验到企业落地，梳理普通用户真正值得关注的变化。</p>
      </article>
    `,
    {
      id: "36kr-ai",
      name: "36氪 · AI",
      url: "https://36kr.com/motif/414",
      category: "AI 产品与商业",
      language: "zh",
      type: "page",
      articlePathPrefix: "/p/",
    }
  );

  assert.equal(items.length, 1);
  assert.equal(items[0].title, "办公 Agent 如何进入真实工作流");
  assert.equal(items[0].link, "https://36kr.com/p/123");
  assert.equal(items[0].source, "36氪 · AI");
});
