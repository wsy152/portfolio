import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ProjectCard } from '../components/ProjectCard';
import { TagFilter } from '../components/TagFilter';
import { collectProjectTags, filterProjectsByTag } from '../lib/content';
import { allProjects } from '../lib/store';
import styles from './ProjectListPage.module.css';

const PAGE_SIZE = 12;

/** 项目列表：技术栈单选筛选，条件写入 URL 查询参数（replace，返回键可恢复） */
export function ProjectListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selected = searchParams.get('tag');
  const tags = collectProjectTags(allProjects);
  const filtered = filterProjectsByTag(allProjects, selected);
  const visible = filtered.slice(0, visibleCount);

  const onSelect = (tag: string | null) => {
    setVisibleCount(PAGE_SIZE);
    // replace 而非 push：返回键不用于在筛选历史里打转
    setSearchParams(tag ? { tag } : {}, { replace: true });
  };

  return (
    <div className="container section">
      <h1 className={styles.title}>项目</h1>
      <p className={styles.lead}>每个项目都写清了问题、方案与结果。按技术栈筛选，或直接看全部。</p>
      <TagFilter tags={tags} selected={selected} onSelect={onSelect} />
      {visible.length === 0 ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <EmptyState
            message={`没有用「${selected}」做的项目。`}
            actionLabel="查看全部项目"
            actionHref="/projects"
          />
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          {filtered.length > visibleCount && (
            <div className={styles.more}>
              <button type="button" className="btn btnSecondary" onClick={() => setVisibleCount(filtered.length)}>
                加载更多（剩余 {filtered.length - visibleCount} 个）
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
