import { describe, expect, it } from 'vitest';
import {
  collectProjectTags,
  filterProjectsByTag,
  groupPostsByYear,
  postPrevNext,
  projectPrevNext,
  publishedPosts,
  publishedProjects,
} from './content';
import type { PostSummary, ProjectSummary } from './schema';

function makeProject(
  partial: Partial<ProjectSummary> & Pick<ProjectSummary, 'slug' | 'title'>,
): ProjectSummary {
  return {
    summary: '示例摘要内容，满足最短长度要求',
    role: '负责人',
    startDate: '2025-01-01',
    stack: ['React'],
    links: [],
    overview: { problem: '示例问题内容，满足最短长度限制', goal: '示例目标内容', result: '示例结果内容' },
    featured: false,
    order: 0,
    draft: false,
    href: `/projects/${partial.slug}`,
    period: '2025.01 – 至今',
    updatedAt: '9999-12-31',
    ...partial,
  };
}

function makePost(partial: Partial<PostSummary> & Pick<PostSummary, 'slug' | 'title'>): PostSummary {
  return {
    date: '2026-01-01',
    tags: [],
    draft: false,
    summary: '示例摘要',
    displayDate: '1月1日',
    readingMinutes: 1,
    href: `/blog/${partial.slug}`,
    year: partial.date?.slice(0, 4) ?? '2026',
    ...partial,
  };
}

describe('草稿过滤', () => {
  it('默认过滤草稿，includeDrafts 时保留', () => {
    const projects = [makeProject({ slug: 'a', title: 'A' }), makeProject({ slug: 'b', title: 'B', draft: true })];
    expect(publishedProjects(projects, false).map((p) => p.slug)).toEqual(['a']);
    expect(publishedProjects(projects, true)).toHaveLength(2);

    const posts = [makePost({ slug: 'a', title: 'A' }), makePost({ slug: 'b', title: 'B', draft: true })];
    expect(publishedPosts(posts, false)).toHaveLength(1);
  });
});

describe('上下篇边界', () => {
  const projects = [
    makeProject({ slug: 'a', title: 'A' }),
    makeProject({ slug: 'b', title: 'B' }),
    makeProject({ slug: 'c', title: 'C' }),
  ];

  it('中间项两侧都有', () => {
    const { prev, next } = projectPrevNext(projects, 'b');
    expect(prev?.slug).toBe('a');
    expect(next?.slug).toBe('c');
  });

  it('首尾只显示存在的方向', () => {
    expect(projectPrevNext(projects, 'a').prev).toBeUndefined();
    expect(projectPrevNext(projects, 'c').next).toBeUndefined();
  });

  it('文章同理，未知 slug 返回空', () => {
    const posts = [makePost({ slug: 'x', title: 'X' })];
    expect(postPrevNext(posts, 'unknown')).toEqual({});
    expect(postPrevNext(posts, 'x')).toEqual({});
  });
});

describe('groupPostsByYear', () => {
  it('按年份分组且保持倒序', () => {
    const posts = [
      makePost({ slug: 'a', title: 'A', date: '2026-09-01' }),
      makePost({ slug: 'b', title: 'B', date: '2026-07-01' }),
      makePost({ slug: 'c', title: 'C', date: '2025-11-01' }),
    ];
    const groups = groupPostsByYear(posts);
    expect(groups.map((g) => g.year)).toEqual(['2026', '2025']);
    expect(groups[0].posts.map((p) => p.slug)).toEqual(['a', 'b']);
  });
});

describe('标签', () => {
  const projects = [
    makeProject({ slug: 'a', title: 'A', stack: ['React', 'TS'] }),
    makeProject({ slug: 'b', title: 'B', stack: ['React'] }),
  ];

  it('统计出现次数并倒序', () => {
    const tags = collectProjectTags(projects);
    expect(tags[0]).toEqual({ tag: 'React', count: 2 });
  });

  it('筛选与取消', () => {
    expect(filterProjectsByTag(projects, 'TS').map((p) => p.slug)).toEqual(['a']);
    expect(filterProjectsByTag(projects, null)).toHaveLength(2);
    expect(filterProjectsByTag(projects, '不存在')).toHaveLength(0);
  });
});
