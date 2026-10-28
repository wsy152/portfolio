/**
 * 预渲染：遍历全部已发布路由 → renderToString → 注入 head/app → 写 dist 目录。
 * 末尾生成 sitemap.xml，并校验每个预期路径都产出了 HTML（缺一个即构建失败）。
 * 草稿不进入路由枚举，自然不产出页面、不进 sitemap。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { publishedPosts, publishedProjects } from '../src/lib/content';
import { loadContent } from '../src/lib/content-build';
import { BASE_PATH, SITE_URL } from '../src/lib/base';

interface RenderResult {
  app: string;
  head: string;
}
type RenderFn = (url: string) => Promise<RenderResult>;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// SITE_URL 必须是合法绝对域名，否则 canonical / og:url / sitemap 全是相对 URL，SEO 规范不允许。
// 开发预览可跳过（环境变量 PASS_SITE_URL_CHECK=1），生产构建强制。
if (!/^https?:\/\//.test(SITE_URL)) {
  if (process.env.PASS_SITE_URL_CHECK) {
    console.warn('[警告] SITE_URL 未配置合法域名，canonical / og:url / sitemap 将产出相对路径，仅开发预览可用。');
  } else {
    console.error(
      '预渲染失败：src/lib/base.ts 中的 SITE_URL 必须填合法域名（如 "https://example.com"）。\n' +
        '如需跳过校验做本地预览，可设置环境变量 PASS_SITE_URL_CHECK=1。',
    );
    process.exit(1);
  }
}

const { data } = await loadContent();
const projects = publishedProjects(data.projects, false);
const posts = publishedPosts(data.posts, false);

const urls: string[] = ['/', '/about', '/projects', '/404'];
if (posts.length > 0) {
  urls.push('/blog');
}
for (const project of projects) {
  urls.push(project.href);
}
for (const post of posts) {
  urls.push(post.href);
}

const { render } = (await import(pathToFileURL(join(ROOT, 'dist-ssr/entry-server.js')).href)) as {
  render: RenderFn;
};

const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

for (const url of urls) {
  const { app, head } = await render(url);
  const html = template.replace('<!--head-->', head).replace('<!--app-->', app);
  if (url === '/') {
    writeFileSync(join(DIST, 'index.html'), html);
    continue;
  }
  if (url === '/404') {
    writeFileSync(join(DIST, '404.html'), html);
    continue;
  }
  // 目录索引（/x/ 与 GitHub Pages 等托管） + 扁平副本（/x 直接被静态服务器命中），两种访问形式都不会落到首页
  mkdirSync(join(DIST, url), { recursive: true });
  writeFileSync(join(DIST, url, 'index.html'), html);
  writeFileSync(join(DIST, `${url}.html`), html);
}

// sitemap（草稿与 404 不进入）—— SEO 的绝对 URL 统一以 SITE_URL 为根，不再叠加 BASE_PATH
const cleanSite = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
const sitemapUrls = urls.filter((u) => u !== '/404');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((u) => `  <url><loc>${cleanSite}${u === '/' ? '/' : u}</loc></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);

// 工作流最后一步把 dist/index.html 复制为 dist/404.html，
// 让 GitHub Pages 的 SPA history 模式在直接访问 /projects/x 时回退到首页再由 React Router 接管。
// 这里加一道保险，保证即使工作流漏了这步构建产物仍然自洽。
writeFileSync(join(DIST, '404.html'), readFileSync(join(DIST, 'index.html'), 'utf-8'));
const missing = urls.filter((url) => {
  const file =
    url === '/' ? join(DIST, 'index.html') : url === '/404' ? join(DIST, '404.html') : join(DIST, url, 'index.html');
  return !existsSync(file);
});
if (missing.length > 0) {
  console.error(`预渲染缺失页面：\n${missing.join('\n')}`);
  process.exit(1);
}

console.log(`预渲染完成：${urls.length} 个页面 + sitemap.xml + 404.html（SPA 回退）`);
