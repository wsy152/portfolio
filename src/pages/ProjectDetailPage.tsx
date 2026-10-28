import { Link, Navigate, useParams } from 'react-router-dom';
import { ExternalLink } from '../components/ExternalLink';
import { ArrowLeftIcon } from '../components/icons';
import { MarkdownBody } from '../components/MarkdownBody';
import { findProject, projectPrevNext } from '../lib/content';
import { allProjects } from '../lib/store';
import { getProjectBody } from '../lib/store-bodies';
import styles from './ProjectDetailPage.module.css';

/** 项目详情：标题区 → 概览三段 → 正文 → 上一篇/下一篇 → 联系入口 */
export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? findProject(allProjects, slug) : undefined;
  const body = project ? getProjectBody(project.slug) : undefined;

  if (!project || !body) {
    return <Navigate to="/404" replace />;
  }

  const { prev, next } = projectPrevNext(allProjects, project.slug);

  return (
    <div className="container section">
      <div style={{ maxWidth: 'var(--prose)' }}>
        <header className={styles.head}>
          <Link to="/projects" className={styles.back}>
            <ArrowLeftIcon /> 返回项目列表
          </Link>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
          <div className={styles.meta}>
            <span>{project.period}</span>
            <span>{project.role}</span>
            {project.teamSize && <span>团队 {project.teamSize} 人</span>}
            <span>{project.stack.join(' / ')}</span>
          </div>
          {project.links.length > 0 && (
            <div className={styles.links}>
              {project.links.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          )}
        </header>

        <div className={styles.overview}>
          <div className={styles.overviewItem}>
            <h2 className={styles.overviewLabel}>问题</h2>
            <p className={styles.overviewText}>{project.overview.problem}</p>
          </div>
          <div className={styles.overviewItem}>
            <h2 className={styles.overviewLabel}>目标</h2>
            <p className={styles.overviewText}>{project.overview.goal}</p>
          </div>
          <div className={styles.overviewItem}>
            <h2 className={styles.overviewLabel}>结果</h2>
            <p className={styles.overviewText}>{project.overview.result}</p>
          </div>
        </div>

        <MarkdownBody html={body.bodyHtml} />

        <nav className={styles.prevNext} aria-label="项目导航">
          <span>{prev && <Link to={prev.href}>← {prev.title}</Link>}</span>
          <span>{next && <Link to={next.href}>{next.title} →</Link>}</span>
        </nav>

        {/* 转化入口只出现在页面底部 */}
        <div className={styles.footerCta}>
          <p className={styles.footerText}>对这个项目有疑问，或想聊聊类似的问题？</p>
          <Link to="/#contact" className="btn btnPrimary">
            联系我
          </Link>
        </div>
      </div>
    </div>
  );
}
