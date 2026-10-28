/**
 * 日期工具：手工解析 YYYY-MM-DD 字符串，不经过 new Date（避免时区偏移）。
 */

export interface ParsedDate {
  year: number;
  month: number;
  day: number;
}

export function parseDate(value: string): ParsedDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`非法日期格式：${value}，期望 YYYY-MM-DD`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`日期不存在：${value}`);
  }
  return { year, month, day };
}

/** 排序用可比较键，例如 "2026-03-04" -> 20260304 */
export function dateSortKey(value: string): number {
  const { year, month, day } = parseDate(value);
  return year * 10000 + month * 100 + day;
}

/**
 * 展示格式：「2026年3月4日」；与参考年同年时省略年份（「3月4日」）。
 * referenceYear 由构建期传入，产物不含依赖当前时间的逻辑。
 */
export function formatDate(value: string, referenceYear?: number): string {
  const { year, month, day } = parseDate(value);
  if (referenceYear !== undefined && year === referenceYear) {
    return `${month}月${day}日`;
  }
  return `${year}年${month}月${day}日`;
}

/** 项目时间段：「2025.03 – 2025.11」或「2025.03 – 至今」 */
export function formatPeriod(startDate: string, endDate?: string): string {
  const start = parseDate(startDate);
  const startText = `${start.year}.${String(start.month).padStart(2, '0')}`;
  if (!endDate) {
    return `${startText} – 至今`;
  }
  const end = parseDate(endDate);
  return `${startText} – ${end.year}.${String(end.month).padStart(2, '0')}`;
}
