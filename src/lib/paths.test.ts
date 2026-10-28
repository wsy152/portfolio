import { describe, expect, it } from 'vitest';
import { postPath, projectPath, withBase } from './paths';

describe('paths', () => {
  it('slug → 路径', () => {
    expect(projectPath('metrics-platform')).toBe('/projects/metrics-platform');
    expect(postPath('first-post')).toBe('/blog/first-post');
  });

  it('withBase 拼接子路径前缀（根路径时原样返回）', () => {
    expect(withBase('/resume.pdf')).toBe('/resume.pdf');
    expect(withBase('assets/a.png')).toBe('/assets/a.png');
  });
});
