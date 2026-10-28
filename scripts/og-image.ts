/**
 * OG 分享图：为默认页与每个已发布项目/文章生成 1200×630 浅色卡片 PNG。
 * 用 resvg 直接渲染 SVG（系统字体），无需设计资源。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../src/data/site';
import { publishedPosts, publishedProjects } from '../src/lib/content';
import { loadContent } from '../src/lib/content-build';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'dist/og');

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 标题按每行 16 个字符手工折行，最多两行 */
function wrapTitle(title: string): string[] {
  const charsPerLine = 16;
  const lines: string[] = [];
  let rest = title;
  while (rest.length > charsPerLine && lines.length < 1) {
    lines.push(rest.slice(0, charsPerLine));
    rest = rest.slice(charsPerLine);
  }
  lines.push(rest.length > charsPerLine ? `${rest.slice(0, charsPerLine - 1)}…` : rest);
  return lines;
}

function buildSvg(title: string): string {
  const lines = wrapTitle(title).map(escapeXml);
  const titleSpans = lines
    .map(
      (line, i) =>
        `<text x="96" y="${lines.length > 1 ? 260 + i * 88 : 300}" font-size="72" font-weight="600" fill="#0f172a" font-family="Microsoft YaHei, PingFang SC, sans-serif">${line}</text>`,
    )
    .join('\n  ');
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="96" y="150" width="64" height="8" fill="#2563eb"/>
  ${titleSpans}
  <text x="96" y="520" font-size="32" fill="#475569" font-family="Microsoft YaHei, PingFang SC, sans-serif">${escapeXml(site.name)} · ${escapeXml(site.tagline)}</text>
  <rect x="0" y="622" width="1200" height="8" fill="#2563eb"/>
</svg>`;
}

function render(svg: string, outFile: string): void {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  writeFileSync(outFile, png);
}

const { data } = await loadContent();
const projects = publishedProjects(data.projects, false);
const posts = publishedPosts(data.posts, false);

mkdirSync(OUT_DIR, { recursive: true });
render(buildSvg(site.name), join(OUT_DIR, 'default.png'));
for (const project of projects) {
  render(buildSvg(project.title), join(OUT_DIR, `project-${project.slug}.png`));
}
for (const post of posts) {
  render(buildSvg(post.title), join(OUT_DIR, `post-${post.slug}.png`));
}

console.log(`OG 图生成完成：${1 + projects.length + posts.length} 张`);
