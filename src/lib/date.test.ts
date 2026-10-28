import { describe, expect, it } from 'vitest';
import { dateSortKey, formatDate, formatPeriod, parseDate } from './date';

describe('parseDate', () => {
  it('解析合法日期', () => {
    expect(parseDate('2026-03-04')).toEqual({ year: 2026, month: 3, day: 4 });
  });

  it('拒绝非法格式', () => {
    expect(() => parseDate('2026/03/04')).toThrow();
    expect(() => parseDate('2026-3-4')).toThrow();
  });

  it('拒绝不存在的日期', () => {
    expect(() => parseDate('2026-02-30')).toThrow();
    expect(() => parseDate('2026-13-01')).toThrow();
  });
});

describe('dateSortKey', () => {
  it('日期越大键越大，跨时区稳定（纯字符串解析）', () => {
    expect(dateSortKey('2026-03-04')).toBeGreaterThan(dateSortKey('2025-12-31'));
  });
});

describe('formatDate', () => {
  it('默认展示完整年月日', () => {
    expect(formatDate('2026-03-04')).toBe('2026年3月4日');
  });

  it('与参考年同年时省略年份', () => {
    expect(formatDate('2026-03-04', 2026)).toBe('3月4日');
    expect(formatDate('2025-03-04', 2026)).toBe('2025年3月4日');
  });
});

describe('formatPeriod', () => {
  it('有结束时间展示区间', () => {
    expect(formatPeriod('2025-03-01', '2025-11-30')).toBe('2025.03 – 2025.11');
  });

  it('无结束时间标注至今', () => {
    expect(formatPeriod('2026-01-15')).toBe('2026.01 – 至今');
  });
});
