/**
 * SEO 元信息：按路由解析 title/description/canonical/og。
 * 预渲染注入静态 HTML，客户端路由切换时由 Seo 组件同步 document。
 */
import { site } from '../data/site';
import { allPosts, allProjects } from './store';
import { BASE_PATH, SITE_URL } from './base';
import { findPost, findProject } from './content';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  image?: string;
}

const DEFAULT_DESCRIPTION = `${site.name}的个人作品集：${site.tagline}。`;

function absoluteUrl(path: string): string {
  // SITE_URL 可能已经带结尾斜杠（GitHub Pages 工作流就是如此），同时 path 是 /xxx 形式，
  // 拼接时先去掉 SITE_URL 的结尾斜杠避免产生双斜杠
  const cleaned = SITE_URL.endsWith('/') ? SITE_URL.slice(0, -1) : SITE_URL;
  return `${cleaned}${path}`;
}

export function resolveMeta(pathname: string): PageMeta {
  const notFound: PageMeta = {
    title: `页面不存在 · ${site.name}`,
    description: DEFAULT_DESCRIPTION,
    path: pathname,
    type: 'website',
  };

  if (pathname === '/' || pathname === '') {
    return { title: `${site.name} · ${site.role}`, description: DEFAULT_DESCRIPTION, path: '/', type: 'website' };
  }
  if (pathname === '/about') {
    return { title: `关于 · ${site.name}`, description: `${site.name}的完整介绍与经历。`, path: '/about', type: 'website' };
  }
  if (pathname === '/projects') {
    return { title: `项目 · ${site.name}`, description: '项目列表：方向、角色与结果。', path: '/projects', type: 'website' };
  }
  if (pathname === '/blog') {
    return { title: `博客 · ${site.name}`, description: '技术文章与工程实践记录。', path: '/blog', type: 'website' };
  }

  const projectMatch = /^\/projects\/([a-z0-9-]+)$/.exec(pathname);
  if (projectMatch) {
    const project = findProject(allProjects, projectMatch[1]);
    if (!project) {
      return notFound;
    }
    return {
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      path: project.href,
      type: 'article',
      image: `/og/project-${project.slug}.png`,
    };
  }

  const postMatch = /^\/blog\/([a-z0-9-]+)$/.exec(pathname);
  if (postMatch) {
    const post = findPost(allPosts, postMatch[1]);
    if (!post) {
      return notFound;
    }
    return {
      title: `${post.title} · ${site.name}`,
      description: post.summary,
      path: post.href,
      type: 'article',
      image: `/og/post-${post.slug}.png`,
    };
  }

  return notFound;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** 生成注入 <!--head--> 的 head 片段 */
export function renderHead(meta: PageMeta): string {
  const canonical = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image ?? '/og/default.png');
  return [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ');
}
