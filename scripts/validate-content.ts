/**
 * 内容校验：独立前置步骤，失败即中断构建，不产出半成品页面。
 * 错误（缺字段、slug 重复、图片不存在、日期非法、正文为空）退出码 1；警告仅提示。
 */
import { loadContent } from '../src/lib/content-build';

const { issues } = await loadContent();

for (const issue of issues) {
  const field = issue.field ? ` 字段 ${issue.field}` : '';
  const line = `[${issue.level === 'error' ? '错误' : '警告'}] ${issue.file}${field}：${issue.message}`;
  if (issue.level === 'error') {
    console.error(line);
  } else {
    console.warn(line);
  }
}

const errors = issues.filter((i) => i.level === 'error');
if (errors.length > 0) {
  console.error(`\n内容校验失败：${errors.length} 处错误。`);
  process.exit(1);
}

console.log(`内容校验通过（${issues.length} 处警告）。`);
