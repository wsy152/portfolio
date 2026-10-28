import type { ReactNode } from 'react';
import { TableOfContents } from '../components/TableOfContents';
import type { Heading } from '../lib/schema';
import styles from './ArticleLayout.module.css';

interface ArticleLayoutProps {
  headings: Heading[];
  children: ReactNode;
}

/** 文章版式：单栏正文 + 桌面宽屏右侧目录 */
export function ArticleLayout({ headings, children }: ArticleLayoutProps) {
  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.columns}>
        <div>{children}</div>
        <TableOfContents headings={headings} />
      </div>
    </div>
  );
}
