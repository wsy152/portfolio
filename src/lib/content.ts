/**
 * 内容查询的纯函数（不依赖虚拟模块，可单测）。
 * 构建期已完成排序与渲染，这里只负责筛选、截取、导航关系。
 */
import type { PostSummary, ProjectSummary } from './schema';

export function publishedProjects(projects: ProjectSummary[], includeDrafts: boolean): ProjectSummary[] {
  return includeDrafts ? projects : projects.filter((p) => !p.draft);
}

export function publishedPosts(posts: PostSummary[], includeDrafts: boolean): PostSummary[] {
  return includeDrafts ? posts : posts.filter((p) => !p.draft);
}

/** 首页精选：featured 优先取 3 个，不足时按排序顺序补齐 */
export function featuredProjects(projects: ProjectSummary[], count = 3): ProjectSummary[] {
  return projects.slice(0, count);
}

export function latestPosts(posts: PostSummary[], count = 3): PostSummary[] {
  return posts.slice(0, count);
}

export function findProject(projects: ProjectSummary[], slug: string): ProjectSummary | undefined {
  return projects.find((p) => p.slug === slug);
}

export function findPost(posts: PostSummary[], slug: string): PostSummary | undefined {
  return posts.find((p) => p.slug === slug);
}

export interface PrevNext<T> {
  prev?: T;
  next?: T;
}

/** 上一篇/下一篇按列表排序生成，首尾只显示存在的方向 */
export function projectPrevNext(projects: ProjectSummary[], slug: string): PrevNext<ProjectSummary> {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return {};
  }
  return { prev: projects[index - 1], next: projects[index + 1] };
}

export function postPrevNext(posts: PostSummary[], slug: string): PrevNext<PostSummary> {
  const index = posts.findIndex((p) => p.slug === slug);
  if (index < 0) {
    return {};
  }
  return { prev: posts[index - 1], next: posts[index + 1] };
}

export interface PostYearGroup {
  year: string;
  posts: PostSummary[];
}

/** 博客列表按年份分组，组间年份倒序（输入已按日期倒序） */
export function groupPostsByYear(posts: PostSummary[]): PostYearGroup[] {
  const groups: PostYearGroup[] = [];
  for (const post of posts) {
    const last = groups[groups.length - 1];
    if (last && last.year === post.year) {
      last.posts.push(post);
    } else {
      groups.push({ year: post.year, posts: [post] });
    }
  }
  return groups;
}

export interface TagInfo {
  tag: string;
  count: number;
}

/** 项目技术栈标签集合，按出现次数倒序 */
export function collectProjectTags(projects: ProjectSummary[]): TagInfo[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const tag of project.stack) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** 按单个技术栈标签筛选；空标签返回全部 */
export function filterProjectsByTag(projects: ProjectSummary[], tag: string | null): ProjectSummary[] {
  if (!tag) {
    return projects;
  }
  return projects.filter((p) => p.stack.includes(tag));
}
