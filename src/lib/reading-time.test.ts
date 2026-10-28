import { describe, expect, it } from 'vitest';
import { computeReadingMinutes, deriveSummary, extractPlainText } from './reading-time';

describe('extractPlainText', () => {
  it('剔除围栏代码块', () => {
    const md = '前文\n```ts\nconst a = 1;\n```\n后文';
    expect(extractPlainText(md)).not.toContain('const');
  });

  it('链接保留文字，图片剔除', () => {
    expect(extractPlainText('[文字](https://a.com)')).toBe('文字');
    expect(extractPlainText('![图](a.png)')).toBe('');
  });

  it('剔除标题与列表标记', () => {
    expect(extractPlainText('## 标题\n- 项目')).toBe('标题 项目');
  });
});

describe('computeReadingMinutes', () => {
  it('最少 1 分钟', () => {
    expect(computeReadingMinutes('很短')).toBe(1);
  });

  it('按 300 字每分钟向上取整', () => {
    const body = '字'.repeat(301);
    expect(computeReadingMinutes(body)).toBe(2);
    const exact = '字'.repeat(600);
    expect(computeReadingMinutes(exact)).toBe(2);
  });
});

describe('deriveSummary', () => {
  it('超长截取 120 字符并加省略号', () => {
    const summary = deriveSummary('字'.repeat(200));
    expect(summary.endsWith('…')).toBe(true);
    expect(summary.length).toBe(121);
  });
});
