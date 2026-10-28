import { Link } from 'react-router-dom';
import { featuredProjects } from '../lib/content';
import { allProjects } from '../lib/store';

/** 404：说明 + 返回首页 + 3 个推荐项目，不显示搜索框 */
export function NotFoundPage() {
  const recommended = featuredProjects(allProjects);

  return (
    <div className="container section" style={{ maxWidth: 'var(--prose)' }}>
      <h1 style={{ fontSize: '30px', marginBottom: 'var(--space-3)' }}>页面不存在</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 'var(--space-4)' }}>
        这个页面可能已移动或删除。你可以返回首页，或看看这些项目：
      </p>
      <Link to="/" className="btn btnPrimary">
        返回首页
      </Link>
      {recommended.length > 0 && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <h2 className="sectionTitle">推荐项目</h2>
          <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-4)' }}>
            {recommended.map((project) => (
              <li key={project.slug} style={{ marginBottom: 'var(--space-2)' }}>
                <Link to={project.href}>{project.title}</Link>
                <span style={{ color: 'var(--muted)' }}> — {project.summary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
