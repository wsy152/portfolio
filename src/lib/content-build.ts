/**
 * 内容读取的 Node 侧实现（构建期运行）：读 content/*.md → gray-matter → Zod 校验
 * → Markdown 渲染 → 派生字段。被 Vite 虚拟模块插件与 validate 脚本共用。
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { z } from 'zod';
import { formatDate, formatPeriod, dateSortKey } from './date';
import { renderMarkdown } from './markdown';
import { computeReadingMinutes, deriveSummary, extractPlainText } from './reading-time';
import {
  postSchema,
  projectSchema,
  type ContentData,
  type PostView,
  type ProjectView,
} from './schema';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const PROJECTS_DIR = join(ROOT, 'content/projects');
const POSTS_DIR = join(ROOT, 'content/blog');

export interface ContentIssue {
  file: string;
  field?: string;
  message: string;
  level: 'error' | 'warning';
}

interface RawEntry {
  file: string;
  data: Record<string, unknown>;
  body: string;
}

function listMarkdown(dir: string): string[] {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(dir, name));
}

function readEntries(dir: string): RawEntry[] {
  return listMarkdown(dir).map((file) => {
    const parsed = matter(readFileSync(file, 'utf-8'));
    return { file, data: parsed.data as Record<string, unknown>, body: parsed.content };
  });
}

/** gray-matter（js-yaml）会把未加引号的日期解析成 Date，这里归一化回 YYYY-MM-DD 字符串 */
function normalizeDates(value: unknown): unknown {
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeDates);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeDates(v)]),
    );
  }
  return value;
}

function validateWith<T>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  entry: RawEntry,
  issues: ContentIssue[],
): T | null {
  const result = schema.safeParse(normalizeDates(entry.data));
  if (!result.success) {
    for (const issue of result.error.issues) {
      issues.push({
        file: entry.file,
        field: issue.path.join('.'),
        message: issue.message,
        level: 'error',
      });
    }
    return null;
  }
  return result.data;
}

function checkCover(cover: string | undefined, entry: RawEntry, issues: ContentIssue[]): void {
  if (!cover) {
    return;
  }
  const target = resolve(dirname(entry.file), cover);
  if (!existsSync(target)) {
    issues.push({
      file: entry.file,
      field: 'cover',
      message: `引用的图片不存在：${cover}`,
      level: 'error',
    });
  }
}

function checkBody(body: string, entry: RawEntry, issues: ContentIssue[]): void {
  if (extractPlainText(body).length === 0) {
    issues.push({ file: entry.file, message: '正文为空或只有标记符号', level: 'error' });
  }
}

function checkSlugUniqueness(entries: RawEntry[], issues: ContentIssue[]): void {
  const seen = new Map<string, string>();
  for (const entry of entries) {
    const slug = typeof entry.data.slug === 'string' ? entry.data.slug : undefined;
    if (!slug) {
      continue;
    }
    const existing = seen.get(slug);
    if (existing) {
      issues.push({
        file: entry.file,
        field: 'slug',
        message: `slug 重复，与 ${existing} 冲突`,
        level: 'error',
      });
    } else {
      seen.set(slug, entry.file);
    }
  }
}

export interface LoadResult {
  data: ContentData;
  issues: ContentIssue[];
}

/**
 * 构建期参考年：「至今」与同年省略年份的判定基准。
 * 产物中的日期展示全部在构建期定型，客户端不出现 new Date()。
 */
const REFERENCE_YEAR = 2026;

export async function loadContent(): Promise<LoadResult> {
  const issues: ContentIssue[] = [];
  const projectEntries = readEntries(PROJECTS_DIR);
  const postEntries = readEntries(POSTS_DIR);
  checkSlugUniqueness([...projectEntries, ...postEntries], issues);

  const projects: ProjectView[] = [];
  for (const entry of projectEntries) {
    const fm = validateWith(projectSchema, entry, issues);
    if (!fm) {
      continue;
    }
    checkCover(fm.cover, entry, issues);
    checkBody(entry.body, entry, issues);
    const rendered = await renderMarkdown(entry.body);
    projects.push({
      ...fm,
      bodyHtml: rendered.html,
      headings: rendered.headings,
      plainText: extractPlainText(entry.body),
      href: `/projects/${fm.slug}`,
      period: formatPeriod(fm.startDate, fm.endDate),
      // 排序键：进行中优先，其次结束时间倒序，再次开始时间倒序
      updatedAt: fm.endDate ?? '9999-12-31',
    });
  }

  const posts: PostView[] = [];
  for (const entry of postEntries) {
    const fm = validateWith(postSchema, entry, issues);
    if (!fm) {
      continue;
    }
    checkCover(fm.cover, entry, issues);
    checkBody(entry.body, entry, issues);
    if (fm.tags.length === 0) {
      issues.push({ file: entry.file, field: 'tags', message: '文章未填写标签', level: 'warning' });
    }
    const rendered = await renderMarkdown(entry.body);
    posts.push({
      ...fm,
      bodyHtml: rendered.html,
      headings: rendered.headings,
      summary: fm.summary ?? deriveSummary(entry.body),
      displayDate: formatDate(fm.date, REFERENCE_YEAR),
      readingMinutes: computeReadingMinutes(entry.body),
      href: `/blog/${fm.slug}`,
      year: fm.date.slice(0, 4),
    });
  }

  // 预排序：项目精选优先 → 进行中优先 → 结束时间倒序；文章日期倒序
  projects.sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    const byEnd = dateSortKey(b.updatedAt) - dateSortKey(a.updatedAt);
    if (byEnd !== 0) {
      return byEnd;
    }
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return dateSortKey(b.startDate) - dateSortKey(a.startDate);
  });
  posts.sort((a, b) => dateSortKey(b.date) - dateSortKey(a.date));

  return { data: { projects, posts }, issues };
}
