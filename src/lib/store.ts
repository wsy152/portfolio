/**
 * 内容数据入口：页面与组件一律从这里取数，不直接读文件。
 * 数据由构建期虚拟模块 virtual:content 注入（含草稿过滤开关）。
 */
import rawContent from 'virtual:content';
import {
  publishedPosts,
  publishedProjects,
} from './content';
import type { ContentSummaries, PostSummary, ProjectSummary } from './schema';

// 开发环境可见草稿；生产构建只保留已发布内容
const includeDrafts = import.meta.env.DEV || import.meta.env.VITE_SHOW_DRAFTS === '1';

const data = rawContent as ContentSummaries;

export const allProjects: ProjectSummary[] = publishedProjects(data.projects, includeDrafts);
export const allPosts: PostSummary[] = publishedPosts(data.posts, includeDrafts);
