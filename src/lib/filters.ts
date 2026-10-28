/**
 * 标签筛选与 URL 查询参数同步（纯函数，可单测）。
 * 静态站没有服务端处理 ?tag=，首屏渲染全部，客户端筛选后用 replaceState 写回。
 */

export function parseTagParam(search: string): string | null {
  const params = new URLSearchParams(search);
  const tag = params.get('tag');
  return tag && tag.trim().length > 0 ? tag : null;
}

/** 生成查询串；tag 为 null 时移除参数（取消筛选） */
export function buildTagSearch(search: string, tag: string | null): string {
  const params = new URLSearchParams(search);
  if (tag === null) {
    params.delete('tag');
  } else {
    params.set('tag', tag);
  }
  const text = params.toString();
  return text ? `?${text}` : '';
}
