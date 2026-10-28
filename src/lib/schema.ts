import { z } from 'zod';

export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期必须是 YYYY-MM-DD');

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(['live', 'repo', 'doc']),
});

export const projectSchema = z.object({
  title: z.string().min(1).max(40),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(10).max(80),
  role: z.string().min(1),
  teamSize: z.number().int().positive().optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  stack: z.array(z.string()).min(1),
  cover: z.string().optional(),
  links: z.array(projectLinkSchema).default([]),
  overview: z.object({
    problem: z.string().min(20),
    goal: z.string().min(10),
    result: z.string().min(10),
  }),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  draft: z.boolean().default(false),
});

export const postSchema = z.object({
  title: z.string().min(1).max(60),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  date: dateString,
  updated: dateString.optional(),
  summary: z.string().max(120).optional(),
  cover: z.string().optional(),
  tags: z.array(z.string()).max(5).default([]),
  draft: z.boolean().default(false),
});

export const siteConfigSchema = z.object({
  name: z.string(),
  role: z.string(),
  tagline: z.string().max(30),
  location: z.string(),
  availability: z.string().optional(),
  email: z.string().email(),
  avatar: z.string().optional(),
  resumeUrl: z.string().optional(),
  social: z.array(z.object({ label: z.string(), href: z.string().url() })),
});

export type ProjectFrontMatter = z.infer<typeof projectSchema>;
export type PostFrontMatter = z.infer<typeof postSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type ProjectLink = z.infer<typeof projectLinkSchema>;

/** 正文标题（目录用），由构建期从 Markdown 提取 */
export interface Heading {
  depth: number;
  text: string;
  id: string;
}

/** 构建期处理后的项目视图模型（含已渲染 HTML） */
export interface ProjectView extends ProjectFrontMatter {
  bodyHtml: string;
  headings: Heading[];
  plainText: string;
  href: string;
  period: string;
  updatedAt: string;
}

/** 构建期处理后的文章视图模型 */
export interface PostView extends Omit<PostFrontMatter, 'summary'> {
  bodyHtml: string;
  headings: Heading[];
  summary: string;
  displayDate: string;
  readingMinutes: number;
  href: string;
  year: string;
}

export interface ContentData {
  projects: ProjectView[];
  posts: PostView[];
}

/** 摘要模型：列表/首页/SEO 使用，不含正文（正文单独拆包，控制首屏体积） */
export type ProjectSummary = Omit<ProjectView, 'bodyHtml' | 'headings' | 'plainText'>;
export type PostSummary = Omit<PostView, 'bodyHtml' | 'headings'>;

export interface ContentSummaries {
  projects: ProjectSummary[];
  posts: PostSummary[];
}

/** 正文数据：随详情页懒加载，不进入首屏包 */
export interface ContentBodies {
  projects: Record<string, Pick<ProjectView, 'bodyHtml' | 'headings'>>;
  posts: Record<string, Pick<PostView, 'bodyHtml' | 'headings'>>;
}
