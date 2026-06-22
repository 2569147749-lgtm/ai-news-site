#!/usr/bin/env node
/*
 * 捕风追影 电影解说视频生成脚本
 * - 使用 node-canvas 绘制 6 个场景 (1280x720)
 * - 使用 fluent-ffmpeg + ffmpeg-static 将图片合成带淡入淡出的 MP4 视频
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { createCanvas, registerFont } = require('canvas');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

// ========= 配置 =========
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 30;
const SCENE_SECONDS = 8;
const OUTPUT_FILE = '/Users/bytedance/Desktop/catching-shadow-review.mp4';
const WORK_DIR = '/Users/bytedance/Desktop/ai-news-site';
const TMP_DIR = path.join(WORK_DIR, '.video-tmp');

// 尝试找一个支持中文的系统字体 (macOS)
const CANDIDATE_FONTS = [
  '/System/Library/Fonts/PingFang.ttc',
  '/System/Library/Fonts/STHeiti Medium.ttc',
  '/System/Library/Fonts/STHeiti Light.ttc',
  '/System/Library/Fonts/Hiragino Sans GB.ttc',
  '/Library/Fonts/Arial Unicode.ttf',
  '/System/Library/Fonts/Supplemental/Arial Unicode.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
];
let CHINESE_FONT = null;
for (const f of CANDIDATE_FONTS) {
  if (fs.existsSync(f)) {
    CHINESE_FONT = f;
    break;
  }
}
if (CHINESE_FONT) {
  try { registerFont(CHINESE_FONT, { family: 'ChineseFont' }); } catch (e) { /* 忽略 */ }
}

const scenes = [
  {
    title: '消失在AI眼前',
    subtitle: '— 捕风追影 · 开场 —',
    colors: ['#0b1e3f', '#1b3b6f', '#0a1530'],
    accent: '#6ec6ff',
    icon: 'camera',
  },
  {
    title: '71岁 VS 67岁',
    subtitle: '两代枭雄,隔代对决',
    colors: ['#3a0d4a', '#7d1b7a', '#ff6fb0'],
    accent: '#ffc8ec',
    icon: 'duel',
  },
  {
    title: '拳拳到肉',
    subtitle: '晾衣杆下的硬核肉搏',
    colors: ['#3a0a0a', '#c93c15', '#ff8a3d'],
    accent: '#ffe0b5',
    icon: 'fight',
  },
  {
    title: '狼群法则',
    subtitle: '暗网之下,数据即猎场',
    colors: ['#0c0a2e', '#3b1a6b', '#1a0d55'],
    accent: '#b090ff',
    icon: 'wolf',
  },
  {
    title: '科技是工具,人心才是根本',
    subtitle: '— 电影核心主题 —',
    colors: ['#022b3a', '#1f7a8c', '#bfdbf7'],
    accent: '#e0fbfc',
    icon: 'human',
  },
  {
    title: '监狱反而是最安全的地方',
    subtitle: '— 电影结局 —',
    colors: ['#1a1208', '#3d2a10', '#b8860b'],
    accent: '#ffd27a',
    icon: 'prison',
  },
];

// ========= 工具函数 =========
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 生成垂直/水平线性渐变
function makeGradient(ctx, colors, direction = 'vertical') {
  let grad;
  if (direction === 'vertical') {
    grad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  } else if (direction === 'horizontal') {
    grad = ctx.createLinearGradient(0, 0, WIDTH, 0);
  } else {
    grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  }
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
  return grad;
}

// 绘制霓虹发光文字
function drawNeonText(ctx, text, x, y, fontSize, color, glowColor, align = 'center') {
  ctx.save();
  ctx.font = `bold ${fontSize}px "ChineseFont", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  // 多层阴影形成霓虹感
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 30;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 60;
  ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawSubtitle(ctx, text, x, y, fontSize, color, align = 'center') {
  ctx.save();
  ctx.font = `${fontSize}px "ChineseFont", "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 6;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ========= 图标绘制 =========
function drawIconCamera(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  // 摄像机主体
  drawRoundedRect(ctx, cx - size / 2, cy - size / 3, size, (size * 2) / 3, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fill();
  ctx.stroke();
  // 镜头
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  // 三角天线
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.15, cy - size / 3);
  ctx.lineTo(cx, cy - size * 0.6);
  ctx.lineTo(cx + size * 0.15, cy - size / 3);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

function drawIconDuel(ctx, cx, cy, size, color1, color2) {
  ctx.save();
  // 左边人剪影
  ctx.fillStyle = color1;
  ctx.beginPath();
  ctx.arc(cx - size * 0.3, cy - size * 0.25, size * 0.12, 0, Math.PI * 2); // 头
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.45, cy - size * 0.1);
  ctx.lineTo(cx - size * 0.15, cy - size * 0.1);
  ctx.lineTo(cx - size * 0.1, cy + size * 0.45);
  ctx.lineTo(cx - size * 0.5, cy + size * 0.45);
  ctx.closePath();
  ctx.fill();
  // 右边人剪影
  ctx.fillStyle = color2;
  ctx.beginPath();
  ctx.arc(cx + size * 0.3, cy - size * 0.25, size * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.15, cy - size * 0.1);
  ctx.lineTo(cx + size * 0.45, cy - size * 0.1);
  ctx.lineTo(cx + size * 0.5, cy + size * 0.45);
  ctx.lineTo(cx + size * 0.1, cy + size * 0.45);
  ctx.closePath();
  ctx.fill();
  // VS
  ctx.font = `bold ${Math.round(size * 0.3)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = color1;
  ctx.shadowBlur = 20;
  ctx.fillText('VS', cx, cy + size * 0.1);
  ctx.restore();
}

function drawIconFight(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  // 晾衣杆 (斜杠)
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.5, cy - size * 0.2);
  ctx.lineTo(cx + size * 0.5, cy + size * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.5, cy - size * 0.2);
  ctx.lineTo(cx - size * 0.5, cy + size * 0.2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  // 拳头
  ctx.beginPath();
  ctx.arc(cx - size * 0.35, cy - size * 0.15, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + size * 0.35, cy + size * 0.15, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  // 冲击线
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    const x1 = cx + Math.cos(a) * size * 0.05;
    const y1 = cy + Math.sin(a) * size * 0.05;
    const x2 = cx + Math.cos(a) * size * 0.2;
    const y2 = cy + Math.sin(a) * size * 0.2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawIconWolf(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  // 狼头剪影 (简化)
  ctx.beginPath();
  // 耳朵
  ctx.moveTo(cx - size * 0.35, cy - size * 0.1);
  ctx.lineTo(cx - size * 0.3, cy - size * 0.4);
  ctx.lineTo(cx - size * 0.15, cy - size * 0.2);
  ctx.lineTo(cx + size * 0.15, cy - size * 0.2);
  ctx.lineTo(cx + size * 0.3, cy - size * 0.4);
  ctx.lineTo(cx + size * 0.35, cy - size * 0.1);
  // 身体
  ctx.lineTo(cx + size * 0.4, cy + size * 0.2);
  ctx.lineTo(cx + size * 0.2, cy + size * 0.35);
  ctx.lineTo(cx, cy + size * 0.4);
  ctx.lineTo(cx - size * 0.2, cy + size * 0.35);
  ctx.lineTo(cx - size * 0.4, cy + size * 0.2);
  ctx.closePath();
  ctx.shadowColor = color;
  ctx.shadowBlur = 25;
  ctx.fill();
  ctx.shadowBlur = 0;
  // 眼睛 (发光)
  ctx.fillStyle = '#ffff66';
  ctx.shadowColor = '#ffff66';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(cx - size * 0.12, cy - size * 0.05, size * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + size * 0.12, cy - size * 0.05, size * 0.04, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawIconHuman(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  // 人形
  ctx.beginPath();
  ctx.arc(cx, cy - size * 0.25, size * 0.12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - size * 0.12);
  ctx.lineTo(cx, cy + size * 0.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.2, cy);
  ctx.lineTo(cx + size * 0.2, cy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.2);
  ctx.lineTo(cx - size * 0.12, cy + size * 0.4);
  ctx.moveTo(cx, cy + size * 0.2);
  ctx.lineTo(cx + size * 0.12, cy + size * 0.4);
  ctx.stroke();
  // 周围数据节点
  ctx.fillStyle = color;
  const nodes = [
    [cx - size * 0.35, cy - size * 0.3],
    [cx + size * 0.35, cy - size * 0.3],
    [cx - size * 0.35, cy + size * 0.3],
    [cx + size * 0.35, cy + size * 0.3],
    [cx, cy - size * 0.45],
    [cx, cy + size * 0.45],
  ];
  nodes.forEach(([nx, ny]) => {
    ctx.beginPath();
    ctx.arc(nx, ny, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(nx, ny);
    ctx.stroke();
  });
  ctx.restore();
}

function drawIconPrison(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  // 顶部/底部横梁
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.5, cy - size * 0.4);
  ctx.lineTo(cx + size * 0.5, cy - size * 0.4);
  ctx.moveTo(cx - size * 0.5, cy + size * 0.4);
  ctx.lineTo(cx + size * 0.5, cy + size * 0.4);
  ctx.stroke();
  // 竖直铁栏
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + (i * size) / 5, cy - size * 0.4);
    ctx.lineTo(cx + (i * size) / 5, cy + size * 0.4);
    ctx.stroke();
  }
  // 锁
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.04, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();
  ctx.restore();
}

// 绘制场景装饰几何图形
function drawDecorations(ctx, scene) {
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = scene.accent;
  ctx.lineWidth = 2;
  // 随机几何圆
  for (let i = 0; i < 8; i++) {
    const x = (i * 173) % WIDTH;
    const y = (i * 217) % HEIGHT;
    const r = 30 + ((i * 17) % 80);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.1;
  // 斜线
  for (let i = -HEIGHT; i < WIDTH; i += 60) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + HEIGHT, HEIGHT);
    ctx.stroke();
  }
  ctx.restore();
}

// 画雨天颗粒
function drawRainParticles(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(180, 220, 255, 0.45)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 120; i++) {
    const x = (i * 97) % WIDTH;
    const y = (i * 131) % HEIGHT;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y + 12);
    ctx.stroke();
  }
  ctx.restore();
}

// 代码流文字
function drawCodeStream(ctx, accent) {
  ctx.save();
  ctx.fillStyle = accent;
  ctx.font = '12px monospace';
  ctx.globalAlpha = 0.35;
  const lines = [
    '01001010 11010110 0xFF3A91',
    'const pack = [wolf, hunt, rule];',
    'trace.backtrack(target, depth=∞);',
    'hash.sha256(...) == 0x0...',
    'while (hunt) { seek(); }',
  ];
  lines.forEach((l, i) => {
    ctx.fillText(l, 40, 80 + i * 22);
  });
  ctx.restore();
}

// ========= 绘制每个场景 =========
function renderScene(scene, index) {
  console.log(`[场景 ${index + 1}] 开始绘制: "${scene.title}"`);
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // 1. 背景渐变
  const bg = makeGradient(ctx, scene.colors, 'diagonal');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. 装饰几何
  drawDecorations(ctx, scene);

  // 3. 特殊装饰
  if (scene.icon === 'camera') drawRainParticles(ctx);
  if (scene.icon === 'wolf') drawCodeStream(ctx, scene.accent);

  // 4. 顶部副标题
  drawSubtitle(ctx, scene.subtitle, WIDTH / 2, 80, 32, 'rgba(255,255,255,0.85)');

  // 5. 中央图标
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2 - 30;
  const size = 220;
  switch (scene.icon) {
    case 'camera':
      drawIconCamera(ctx, cx, cy, size, scene.accent);
      break;
    case 'duel':
      drawIconDuel(ctx, cx, cy, size, scene.accent, '#ffffff');
      break;
    case 'fight':
      drawIconFight(ctx, cx, cy, size, scene.accent);
      break;
    case 'wolf':
      drawIconWolf(ctx, cx, cy, size, scene.accent);
      break;
    case 'human':
      drawIconHuman(ctx, cx, cy, size, scene.accent);
      break;
    case 'prison':
      drawIconPrison(ctx, cx, cy, size, scene.accent);
      break;
  }

  // 6. 底部主标题 (霓虹效果)
  const titleFontSize = scene.title.length > 10 ? 64 : 84;
  drawNeonText(ctx, scene.title, WIDTH / 2, HEIGHT - 140, titleFontSize, '#ffffff', scene.accent);

  // 7. 场景编号角标
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '20px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`SCENE ${String(index + 1).padStart(2, '0')} / 06`, WIDTH - 40, HEIGHT - 30);
  ctx.textAlign = 'left';
  ctx.fillText('《捕风追影》电影解说', 40, HEIGHT - 30);
  ctx.restore();

  return canvas;
}

// ========= 主流程 =========
async function main() {
  console.log('========== 《捕风追影》视频生成脚本启动 ==========');
  console.log(`工作目录: ${WORK_DIR}`);
  console.log(`临时目录: ${TMP_DIR}`);
  console.log(`输出文件: ${OUTPUT_FILE}`);
  console.log(`画布尺寸: ${WIDTH}x${HEIGHT}, 帧率: ${FPS}, 单场景时长: ${SCENE_SECONDS}s`);
  console.log(`ffmpeg 路径: ${ffmpegPath}`);
  console.log(`中文字体: ${CHINESE_FONT || '未找到,将使用默认字体'}`);
  console.log(`场景数量: ${scenes.length}`);

  ensureDir(TMP_DIR);

  // 1. 绘制并保存每个场景 PNG
  const pngFiles = [];
  for (let i = 0; i < scenes.length; i++) {
    const canvas = renderScene(scenes[i], i);
    const outPath = path.join(TMP_DIR, `scene-${String(i + 1).padStart(2, '0')}.png`);
    const buf = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, buf);
    pngFiles.push(outPath);
    console.log(`[场景 ${i + 1}] 已保存 -> ${outPath} (${Math.round(buf.length / 1024)} KB)`);
  }

  // 2. 用 ffmpeg 将每个 PNG 转换为带持续时长的片段 MP4,并添加淡入淡出
  console.log('\n========== 开始用 ffmpeg 合成视频 ==========');
  const segmentFiles = [];

  for (let i = 0; i < pngFiles.length; i++) {
    const segPath = path.join(TMP_DIR, `seg-${String(i + 1).padStart(2, '0')}.mp4`);
    segmentFiles.push(segPath);
    console.log(`\n[片段 ${i + 1}] 生成中 -> ${segPath}`);
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(pngFiles[i])
        .inputOptions(['-loop 1', `-t ${SCENE_SECONDS}`, '-framerate 30'])
        .outputOptions([
          '-pix_fmt yuv420p',
          '-c:v libx264',
          '-preset medium',
          '-crf 20',
          `-r ${FPS}`,
          // 淡入 1s, 淡出 1s (fade=in:0:30 + fade=out:duration-30:30)
          `-vf fade=t=in:st=0:d=1,fade=t=out:st=${SCENE_SECONDS - 1}:d=1`,
          '-movflags +faststart',
        ])
        .duration(SCENE_SECONDS)
        .output(segPath)
        .on('start', (cmd) => console.log(`[片段 ${i + 1}] ffmpeg 命令: ${cmd.split('\n')[0]}`))
        .on('progress', (p) => {
          if (p && p.percent) console.log(`[片段 ${i + 1}] 进度: ${p.percent.toFixed(1)}%`);
        })
        .on('end', () => {
          console.log(`[片段 ${i + 1}] 完成 ✓`);
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error(`[片段 ${i + 1}] 失败: ${err.message}`);
          console.error(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          reject(err);
        })
        .run();
    });
  }

  // 3. 使用 concat demuxer 拼接所有片段
  console.log('\n========== 拼接所有片段为最终视频 ==========');
  const concatTxt = path.join(TMP_DIR, 'concat-list.txt');
  const concatContent = segmentFiles.map((f) => `file '${f.replace(/'/g, "\\'")}'`).join('\n');
  fs.writeFileSync(concatTxt, concatContent, 'utf8');
  console.log(`concat list:\n${concatContent}`);

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(concatTxt)
      .inputOptions(['-f concat', '-safe 0'])
      .outputOptions([
        '-c copy',
        '-movflags +faststart',
      ])
      .output(OUTPUT_FILE)
      .on('start', (cmd) => console.log(`[拼接] ffmpeg 命令: ${cmd.split('\n')[0]}`))
      .on('progress', (p) => {
        if (p && p.percent) console.log(`[拼接] 进度: ${p.percent.toFixed(1)}%`);
      })
      .on('end', () => {
        console.log('[拼接] 完成 ✓');
        resolve();
      })
      .on('error', (err, stdout, stderr) => {
        console.error(`[拼接] 失败: ${err.message}`);
        console.error(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        reject(err);
      })
      .run();
  });

  // 4. 输出文件信息
  console.log('\n========== 生成完成 ==========');
  const stats = fs.statSync(OUTPUT_FILE);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const durationSec = scenes.length * SCENE_SECONDS;
  console.log(`输出文件: ${OUTPUT_FILE}`);
  console.log(`文件大小: ${sizeMB} MB (${stats.size} bytes)`);
  console.log(`预计时长: ${durationSec} 秒 (${(durationSec / 60).toFixed(2)} 分钟)`);
  console.log(`帧率: ${FPS} fps`);
  console.log(`分辨率: ${WIDTH}x${HEIGHT}`);

  // 可选:清理临时 PNG 和片段
  console.log('\n(临时文件保留在 ' + TMP_DIR + ',如需清理请手动删除)');
}

main().catch((err) => {
  console.error('\n========== 错误 ==========');
  console.error(err);
  process.exit(1);
});
