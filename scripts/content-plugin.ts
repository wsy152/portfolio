/**
 * Vite 虚拟模块插件：把 content/ 目录的 Markdown 处理结果作为 JSON 模块
 * 注入客户端与 SSR 构建，两端共享同一份数据，保证 hydration 一致。
 */
import type { Plugin } from 'vite';
import { loadContent } from '../src/lib/content-build';

const VIRTUAL_ID = 'virtual:content';
const VIRTUAL_BODIES_ID = 'virtual:content-bodies';
const RESOLVED_ID = '\0virtual:content';
const RESOLVED_BODIES_ID = '\0virtual:content-bodies';

export function contentPlugin(): Plugin {
  return {
    name: 'portfolio-content',
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID;
      }
      if (id === VIRTUAL_BODIES_ID) {
        return RESOLVED_BODIES_ID;
      }
      return null;
    },
    async load(id) {
      if (id !== RESOLVED_ID && id !== RESOLVED_BODIES_ID) {
        return null;
      }
      const { data, issues } = await loadContent();
      const errors = issues.filter((i) => i.level === 'error');
      for (const issue of issues) {
        const label = issue.level === 'error' ? '错误' : '警告';
        const field = issue.field ? ` 字段 ${issue.field}` : '';
        this.warn(`[内容${label}] ${issue.file}${field}：${issue.message}`);
      }
      if (errors.length > 0) {
        this.error(`内容校验未通过，共 ${errors.length} 处错误，构建中断。`);
      }
      if (id === RESOLVED_BODIES_ID) {
        // 正文单独成模块：只有详情页（懒加载 chunk）会引用
        const bodies = {
          projects: Object.fromEntries(
            data.projects.map((p) => [p.slug, { bodyHtml: p.bodyHtml, headings: p.headings }]),
          ),
          posts: Object.fromEntries(
            data.posts.map((p) => [p.slug, { bodyHtml: p.bodyHtml, headings: p.headings }]),
          ),
        };
        return `export default ${JSON.stringify(bodies)};`;
      }
      const summaries = {
        projects: data.projects.map(({ bodyHtml, headings, plainText, ...rest }) => rest),
        posts: data.posts.map(({ bodyHtml, headings, ...rest }) => rest),
      };
      return `export default ${JSON.stringify(summaries)};`;
    },
  };
}
