/**
 * 正文数据入口：仅详情页（懒加载 chunk）引用，不进入首屏包。
 */
import rawBodies from 'virtual:content-bodies';
import type { ContentBodies, Heading } from './schema';

const bodies = rawBodies as ContentBodies;

export interface BodyResult {
  bodyHtml: string;
  headings: Heading[];
}

export function getProjectBody(slug: string): BodyResult | undefined {
  return bodies.projects[slug];
}

export function getPostBody(slug: string): BodyResult | undefined {
  return bodies.posts[slug];
}
