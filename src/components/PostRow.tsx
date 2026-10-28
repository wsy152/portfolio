import { Link } from 'react-router-dom';
import type { PostSummary } from '../lib/schema';
import styles from './PostRow.module.css';

interface PostRowProps {
  post: PostSummary;
}

/** 博客列表行：标题、摘要（最多两行）、日期、标签、阅读时长 */
export function PostRow({ post }: PostRowProps) {
  return (
    <Link to={post.href} className={styles.row}>
      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.summary}>{post.summary}</p>
      <span className={styles.meta}>
        <time dateTime={post.date}>{post.displayDate}</time>
        <span>约 {post.readingMinutes} 分钟</span>
        {post.tags.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </span>
    </Link>
  );
}
