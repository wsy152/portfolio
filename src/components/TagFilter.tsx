import type { TagInfo } from '../lib/content';
import styles from './TagFilter.module.css';

interface TagFilterProps {
  tags: TagInfo[];
  selected: string | null;
  onSelect: (tag: string | null) => void;
}

/** 技术栈筛选：单选，重复点击已选标签即取消 */
export function TagFilter({ tags, selected, onSelect }: TagFilterProps) {
  return (
    <div className={styles.bar} role="group" aria-label="按技术栈筛选">
      <button
        type="button"
        className={`${styles.tag} ${selected === null ? styles.selected : ''}`}
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
      >
        全部
      </button>
      {tags.map(({ tag, count }) => (
        <button
          key={tag}
          type="button"
          className={`${styles.tag} ${selected === tag ? styles.selected : ''}`}
          aria-pressed={selected === tag}
          onClick={() => onSelect(selected === tag ? null : tag)}
        >
          {tag} · {count}
        </button>
      ))}
    </div>
  );
}
