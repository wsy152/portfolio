import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../lib/schema';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: ProjectSummary;
}

/** 项目卡片：stretched-link 模式——标题链接覆盖整卡，外链为同级锚点，避免非法的 a 嵌套 a */
export function ProjectCard({ project }: ProjectCardProps) {
  const external = project.links[0];
  return (
    <article className={styles.card}>
      <div className={styles.cover} aria-hidden="true">
        {project.title.slice(0, 1)}
      </div>
      <h3 className={styles.title}>
        <Link to={project.href} className={styles.titleLink}>
          {project.title}
        </Link>
      </h3>
      <p className={styles.summary}>{project.summary}</p>
      <p className={styles.meta}>
        {project.role} · {project.period}
      </p>
      <div className={styles.tags}>
        {project.stack.slice(0, 3).map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
        {external && (
          <a
            href={external.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`chip ${styles.external}`}
            aria-label={`${external.label}（新窗口打开）`}
          >
            {external.label} ↗
          </a>
        )}
      </div>
    </article>
  );
}
