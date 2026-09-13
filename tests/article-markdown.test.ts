import assert from "node:assert/strict";
import test from "node:test";
import { htmlToArticleMarkdown } from "../lib/article-markdown";
import {
  enrichArticleMarkdown,
  getArticleAttribution,
  stripArticleBoilerplate,
} from "../lib/article-format";

test("preserves headings, paragraphs, lists, quotes, and images as markdown", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <h2>机器人正在进厂</h2>
        <p>这是第一段正文。</p>
        <img src="/images/robot.jpg" alt="机器人在工厂" />
        <blockquote>这是重要判断。</blockquote>
        <ul><li>成本下降</li><li>产能提升</li></ul>
      </article>
    `,
    "https://example.com/article"
  );

  assert.match(markdown, /## 机器人正在进厂/);
  assert.match(markdown, /这是第一段正文。/);
  assert.match(markdown, /!\[机器人在工厂\]\(https:\/\/example.com\/images\/robot.jpg\)/);
  assert.match(markdown, /> 这是重要判断。/);
  assert.match(markdown, /- 成本下降/);
});

test("excludes author avatars and promotes styled section titles", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <div class="author-card">
          <img class="author-avatar" src="/avatar.png" alt="听雨头像" width="96" height="96" />
          <p>听雨 发自 凹非寺 量子位 | 公众号 QbitAI</p>
        </div>
        <p class="section-title"><strong>只为服务 Meta 的销售岗</strong></p>
        <p>这是有明确层级的一段正文内容。</p>
        <img class="article-image" src="/images/meta-job.png" alt="招聘页面" width="1200" height="680" />
      </article>
    `,
    "https://example.com/article"
  );

  assert.doesNotMatch(markdown, /avatar\.png/);
  assert.match(markdown, /## 只为服务 Meta 的销售岗/);
  assert.match(markdown, /听雨 发自 凹非寺/);
  assert.match(
    markdown,
    /!\[招聘页面\]\(https:\/\/example.com\/images\/meta-job.png "image;w=1200;h=680"\)/
  );
});

test("removes source bylines from reading content while keeping commentary distinct", () => {
  const markdown = enrichArticleMarkdown(
    "原来你俩互相下单呢\n\n听雨 发自 凹非寺 量子位 | 公众号 QbitAI\n\n这是正文。"
  );

  assert.match(markdown, /> 原来你俩互相下单呢/);
  assert.doesNotMatch(markdown, /听雨 发自 凹非寺/);
});

test("does not turn ordinary prose into a source information callout", () => {
  const markdown = enrichArticleMarkdown(
    "> [来源信息] 界面简洁明了，游戏开始前，我可以选择游戏人数，还能手动编辑玩家姓名。"
  );

  assert.doesNotMatch(markdown, /^>/);
  assert.doesNotMatch(markdown, /\[来源信息]/);
  assert.match(markdown, /界面简洁明了/);
});

test("preserves safe lazy media, captions, tables, and code while excluding embeds", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <p>正文开场。</p>
        <figure>
          <img data-src="/media/demo.gif" alt="产品演示动图" width="960" height="540" />
          <figcaption>演示：产品操作过程</figcaption>
        </figure>
        <video controls poster="/media/poster.jpg">
          <source src="/media/demo.mp4" type="video/mp4" />
        </video>
        <audio controls src="/media/brief.mp3"></audio>
        <table>
          <thead><tr><th>产品</th><th>能力</th></tr></thead>
          <tbody><tr><td>助手</td><td>总结</td></tr></tbody>
        </table>
        <pre><code>const answer = "AI";</code></pre>
        <iframe src="https://untrusted.example/embed"></iframe>
      </article>
    `,
    "https://example.com/article"
  );

  assert.match(
    markdown,
    /!\[产品演示动图\]\(https:\/\/example\.com\/media\/demo\.gif "image;w=960;h=540"\)/
  );
  assert.match(markdown, /\*演示：产品操作过程\*/);
  assert.match(
    markdown,
    /!\[视频\]\(https:\/\/example\.com\/media\/demo\.mp4 "video"\)/
  );
  assert.match(
    markdown,
    /!\[音频\]\(https:\/\/example\.com\/media\/brief\.mp3 "audio"\)/
  );
  assert.match(markdown, /\| 产品 \| 能力 \|/);
  assert.match(markdown, /```[\s\S]*const answer = "AI";[\s\S]*```/);
  assert.doesNotMatch(markdown, /untrusted\.example/);
});

test("retains source image dimensions and separates a following image credit from prose", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <img
          src="/media/flappy.gif"
          alt="Flappy Bird 3D 演示"
          width="548"
          height="900"
        />
        <p>当年爆火的《Flappy Bird》的3D版｜图片来源：Pocket</p>
        <p>这才是下一段正文，应保持普通段落。</p>
      </article>
    `,
    "https://example.com/article"
  );
  const formatted = enrichArticleMarkdown(markdown);

  assert.match(
    formatted,
    /!\[Flappy Bird 3D 演示\]\(https:\/\/example\.com\/media\/flappy\.gif "image;w=548;h=900"\)/
  );
  assert.match(
    formatted,
    /\*当年爆火的《Flappy Bird》的3D版｜图片来源：Pocket\*/
  );
  assert.match(formatted, /这才是下一段正文，应保持普通段落。/);
});

test("retains inline emphasis, links, ordered steps, and section dividers", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <p>这是<strong>重点结论</strong>，也有<em>补充说明</em>和<a href="/report">原始报告</a>。</p>
        <ol><li>先确认信息</li><li>再阅读原文</li></ol>
        <hr />
        <p>分割线之后是下一节正文。</p>
      </article>
    `,
    "https://example.com/article"
  );

  assert.match(markdown, /这是\*\*重点结论\*\*，也有\*补充说明\*和\[原始报告\]\(https:\/\/example\.com\/report\)。/);
  assert.match(markdown, /1\. 先确认信息/);
  assert.match(markdown, /1\. 再阅读原文/);
  assert.match(markdown, /---/);
});

test("skips a paragraph that duplicates text embedded in the preceding image", () => {
  const markdown = htmlToArticleMarkdown(
    `
      <article>
        <img
          src="/media/pocket.jpg"
          alt="「程序」，可以成为一种社交媒体的内容单位吗？"
          width="1200"
          height="630"
        />
        <p>「程序」，可以成为一种社交媒体的内容单位吗？</p>
        <p>这是图片之后真正需要保留的正文。</p>
      </article>
    `,
    "https://example.com/article"
  );

  assert.equal((markdown.match(/社交媒体的内容单位/g) || []).length, 1);
  assert.match(markdown, /这是图片之后真正需要保留的正文。/);
});

test("extracts an attribution and removes repeated source boilerplate from reading content", () => {
  const sourceText =
    "本文来自微信公众号：极客公园，作者：Moonshot，编辑：靖宇，原文标题：《AI 时代的「4399」，可把我玩嗨了｜AI 上新》打开 Pocket 的前十分钟，我以为自己打开了一个 Instagram 版的4399。";

  assert.deepEqual(getArticleAttribution(sourceText, "虎嗅 · AI"), {
    publication: "极客公园",
    author: "Moonshot",
  });
  assert.equal(
    stripArticleBoilerplate(sourceText),
    "打开 Pocket 的前十分钟，我以为自己打开了一个 Instagram 版的4399。"
  );
});

test("keeps the first sentence when an RSS byline runs into it without punctuation", () => {
  const sourceText =
    "本文来自微信公众号：[界面新闻](https://mp.weixin.qq.com/s/example)，作者：佘晓晨 AI仍然是一级市场最活跃的投资方向之一。";

  assert.deepEqual(getArticleAttribution(sourceText, "虎嗅 · AI"), {
    publication: "界面新闻",
    author: "佘晓晨",
  });
  assert.equal(
    stripArticleBoilerplate(sourceText),
    "AI仍然是一级市场最活跃的投资方向之一。"
  );
});

test("drops an orphaned image credit instead of rendering it as body prose", () => {
  const markdown = enrichArticleMarkdown(
    "第一段正文。\n\n图片来源：界面图库\n\n第二段正文。"
  );

  assert.doesNotMatch(markdown, /图片来源：界面图库/);
  assert.match(markdown, /第一段正文。/);
  assert.match(markdown, /第二段正文。/);
});

test("removes only the leading attribution block without flattening markdown content", () => {
  const content = [
    "本文来自微信公众号：[界面新闻](https://mp.weixin.qq.com/s/example)，作者：佘晓晨",
    "AI仍然是一级市场最活跃的投资方向之一。",
    "## 小标题",
    "![配图](https://img.huxiucdn.com/example.png)",
    "图片来源：界面图库",
  ].join("\n\n");

  const cleaned = stripArticleBoilerplate(content);

  assert.doesNotMatch(cleaned, /本文来自微信公众号/);
  assert.match(cleaned, /^AI仍然是一级市场/);
  assert.match(cleaned, /\n\n## 小标题\n\n/);
  assert.match(cleaned, /!\[配图]\(https:\/\/img\.huxiucdn\.com\/example\.png\)/);
});
