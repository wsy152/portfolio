import type { Heading } from '../lib/schema';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  headings: Heading[];
}

/** 静态目录：仅在标题数 ≥ 3 时渲染，锚点滚动偏移由 scroll-margin-top 处理 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length < 3) {
    return null;
  }
  return (
    <nav className={styles.toc} aria-label="文章目录">
      <h2 className={styles.title}>目录</h2>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`${styles.item} ${heading.depth === 3 ? styles.depth3 : ''}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
