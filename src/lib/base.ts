// 站点基础路径 —— 构建时读取 GH_PAGES_BASE 环境变量，否则回退到 '/'
// GitHub Pages 仓库（<用户名>.github.io/<仓库名>/）需要 '/<仓库名>/' 作为 base
// 本地开发 / 自建域名部署为 '/'
export const BASE_PATH = (() => {
  const fromEnv = process.env.GH_PAGES_BASE || process.env.VITE_BASE;
  if (fromEnv) {
    return fromEnv.startsWith('/') ? fromEnv : `/${fromEnv}`;
  }
  return '/';
})();

/**
 * 站点绝对地址 —— 构建时读取 SITE_URL 环境变量，否则空串
 * 同时驱动 canonical / og:url / sitemap；留空时 SEO 会退化为相对路径，构建警告。
 */
export const SITE_URL = process.env.SITE_URL ?? '';
