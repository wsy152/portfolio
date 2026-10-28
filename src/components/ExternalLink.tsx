/** 站外链接：新窗口打开 + rel 安全属性 + 去向图标 */
import type { ReactNode } from 'react';
import { ExternalIcon } from './icons';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function ExternalLink({ href, children, className, showIcon = true }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showIcon && (
        <>
          {' '}
          <ExternalIcon />
          <span className="srOnly">（新窗口打开）</span>
        </>
      )}
    </a>
  );
}
