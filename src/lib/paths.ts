/** 路由路径生成：slug → path，统一拼接子路径前缀 */
import { BASE_PATH } from './base';

/** 站内路径拼接 base（用于静态资源与绝对地址；路由跳转用 react-router 自带 basename） */
export function withBase(path: string): string {
  const base = BASE_PATH.endsWith('/') ? BASE_PATH.slice(0, -1) : BASE_PATH;
  if (!path.startsWith('/')) {
    return `${base}/${path}`;
  }
  return `${base}${path}`;
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`;
}

export function postPath(slug: string): string {
  return `/blog/${slug}`;
}
