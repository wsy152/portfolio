import { EmptyState } from '../components/EmptyState';
import { PostRow } from '../components/PostRow';
import { groupPostsByYear } from '../lib/content';
import { allPosts } from '../lib/store';
import styles from './BlogListPage.module.css';

/** 博客列表：按年份分组，组内按日期倒序 */
export function BlogListPage() {
  if (allPosts.length === 0) {
    return (
      <div className="container section">
        <h1 className={styles.title}>博客</h1>
        <EmptyState message="暂无文章，正在整理中。" actionLabel="返回首页" actionHref="/" />
      </div>
    );
  }

  const groups = groupPostsByYear(allPosts);

  return (
    <div className="container section">
      <h1 className={styles.title}>博客</h1>
      <p className={styles.count}>共 {allPosts.length} 篇</p>
      {groups.map((group) => (
        <section key={group.year}>
          <h2 className={styles.year}>{group.year}</h2>
          <div className={styles.yearGroup}>
            {group.posts.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
