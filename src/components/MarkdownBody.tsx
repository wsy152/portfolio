import { useEffect, useRef } from 'react';

interface MarkdownBodyProps {
  html: string;
}

/**
 * 渲染构建期已消毒的 Markdown HTML（rehype-sanitize 白名单过滤）。
 * 代码块复制按钮：复制 pre 内纯文本（Shiki 默认无行号），成功后 2 秒还原文案。
 */
export function MarkdownBody({ html }: MarkdownBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('.codeCopy');
      if (!button) {
        return;
      }
      const pre = button.parentElement?.querySelector('pre');
      const text = pre?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '已复制';
        setTimeout(() => {
          button.textContent = '复制';
        }, 2000);
      } catch {
        button.textContent = '复制失败';
      }
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, []);

  // HTML 已在构建期经 rehype-sanitize 消毒
  return <div ref={containerRef} className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
