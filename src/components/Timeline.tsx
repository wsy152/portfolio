import type { Experience } from '../data/site';
import styles from './Timeline.module.css';

interface TimelineProps {
  items: Experience[];
}

/** 经历时间线：单列竖线，倒序，进行中标注「至今」排最前 */
export function Timeline({ items }: TimelineProps) {
  if (items.length === 0) {
    return null;
  }
  return (
    <ol className={styles.timeline}>
      {items.map((item) => (
        <li key={`${item.company}-${item.period}`} className={`${styles.item} ${item.current ? styles.current : ''}`}>
          <span className={styles.dot} aria-hidden="true" />
          <p className={styles.period}>{item.period}</p>
          <h3 className={styles.title}>
            {item.company} · {item.title}
          </h3>
          <p className={styles.outcome}>{item.outcome}</p>
        </li>
      ))}
    </ol>
  );
}
