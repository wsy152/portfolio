import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/icons';
import { MarkdownBody } from '../components/MarkdownBody';
import { site } from '../data/site';
import { ArticleLayout } from '../layouts/ArticleLayout';
import { findPost, postPrevNext } from '../lib/content';
import { allPosts } from '../lib/store';
import { getPostBody } from '../lib/store-bodies';
import styles from './BlogDetailPage.module.css';

/** 文章详情：返回 + 标题 + 元信息 → 正文（右侧目录）→ 作者卡 → 上一篇/下一篇 */
export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? findPost(allPosts, slug) : undefined;
  const body = post ? getPostBody(post.slug) : undefined;

  if (!post || !body) {
    return <Navigate to="/404" replace />;
  }

  const { prev, next } = postPrevNext(allPosts, post.slug);

  return (
    <ArticleLayout headings={body.headings}>
      <header className={styles.head}>
        <Link to="/blog" className={styles.back}>
          <ArrowLeftIcon /> 返回博客
        </Link>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <time dateTime={post.date}>{post.displayDate}</time>
          <span>约 {post.readingMinutes} 分钟</span>
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <MarkdownBody html={body.bodyHtml} />

      <div className={styles.author}>
        <div className={styles.authorAvatar} aria-hidden="true">
          {site.name.slice(0, 1)}
        </div>
        <div>
          <p className={styles.authorName}>{site.name}</p>
          <p className={styles.authorBio}>{site.tagline}</p>
        </div>
      </div>

      <nav className={styles.prevNext} aria-label="文章导航">
        <span>{prev && <Link to={prev.href}>← {prev.title}</Link>}</span>
        <span>{next && <Link to={next.href}>{next.title} →</Link>}</span>
      </nav>
    </ArticleLayout>
  );
}
