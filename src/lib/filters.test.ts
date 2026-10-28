import { describe, expect, it } from 'vitest';
import { buildTagSearch, parseTagParam } from './filters';

describe('parseTagParam', () => {
  it('解析标签参数', () => {
    expect(parseTagParam('?tag=React')).toBe('React');
    expect(parseTagParam('?tag=Type%20Script')).toBe('Type Script');
  });

  it('无参数或空值返回 null', () => {
    expect(parseTagParam('')).toBeNull();
    expect(parseTagParam('?tag=')).toBeNull();
    expect(parseTagParam('?other=1')).toBeNull();
  });
});

describe('buildTagSearch', () => {
  it('写入与取消', () => {
    expect(buildTagSearch('', 'React')).toBe('?tag=React');
    expect(buildTagSearch('?tag=React', null)).toBe('');
  });

  it('覆盖已有标签', () => {
    expect(buildTagSearch('?tag=A', 'B')).toBe('?tag=B');
  });
});
