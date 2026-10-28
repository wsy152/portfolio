/**
 * 体积预算校验：
 * - 首屏 JS（gzip）合计 ≤ 100KB，超限构建失败（先删依赖，不调高预算）
 * - 单张图片 ≤ 200KB，超限报警
 */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const JS_BUDGET = 100 * 1024;
const IMAGE_BUDGET = 200 * 1024;

const assetsDir = join(DIST, 'assets');
// 只统计首屏 chunk：入口（index-*.js）与其静态依赖（react-*.js vendor 包）；
// 详情页与正文数据为懒加载 chunk，不计入首屏预算。
const jsFiles = readdirSync(assetsDir).filter((name) => /^(index|react)-.*\.js$/.test(name));

let totalGzip = 0;
for (const name of jsFiles) {
  const size = gzipSync(readFileSync(join(assetsDir, name))).length;
  totalGzip += size;
  console.log(`  ${name}: ${(size / 1024).toFixed(1)}KB (gzip)`);
}
console.log(`首屏 JS 合计：${(totalGzip / 1024).toFixed(1)}KB / 预算 100KB`);
if (totalGzip > JS_BUDGET) {
  console.error('首屏 JS 超出预算，构建失败。');
  process.exit(1);
}

// 图片体积扫描（public 与 og 产物）
function scanImages(dir: string): string[] {
  const results: string[] = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) {
      results.push(...scanImages(full));
    } else if (/\.(png|jpe?g|webp|gif)$/.test(name.name) && statSync(full).size > IMAGE_BUDGET) {
      results.push(full);
    }
  }
  return results;
}

const oversized = scanImages(DIST);
for (const file of oversized) {
  console.warn(`[警告] 图片超过 200KB：${file}`);
}

console.log('体积预算校验通过。');
