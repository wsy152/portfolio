/**
 * 阅读时长：去掉代码块与 Markdown 标记后统计字符数，300 字/分钟，向上取整，最少 1 分钟。
 */

/** 提取正文的纯文本（剔除代码块、行内代码标记与 Markdown 语法符号） */
export function extractPlainText(markdown: string): string {
  return (
    markdown
      // 围栏代码块整体剔除
      .replace(/```[\s\S]*?(```|$)/g, ' ')
      // 行内代码剔除
      .replace(/`[^`]*`/g, ' ')
      // 图片剔除、链接保留文字
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // 标题、引用、列表、加粗等标记
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^>\s?/gm, '')
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
      // 表格分隔行
      .replace(/^\|[\s:|-]+\|$/gm, '')
      .replace(/\|/g, ' ')
      // HTML 标签
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

export function countReadableChars(text: string): number {
  return text.replace(/\s+/g, '').length;
}

export function computeReadingMinutes(markdown: string): number {
  const plain = extractPlainText(markdown);
  return Math.max(1, Math.ceil(countReadableChars(plain) / 300));
}

/** 文章摘要缺省时截取正文纯文本前 120 字符 */
export function deriveSummary(markdown: string, maxLength = 120): string {
  const plain = extractPlainText(markdown);
  if (plain.length <= maxLength) {
    return plain;
  }
  return `${plain.slice(0, maxLength)}…`;
}
