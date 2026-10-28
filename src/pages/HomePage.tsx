import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { PostRow } from '../components/PostRow';
import { ProjectCard } from '../components/ProjectCard';
import { ResumeButton } from '../components/ResumeButton';
import { SkillGroup } from '../components/SkillGroup';
import { CopyEmailButton } from '../components/CopyEmailButton';
import { skills } from '../data/skills';
import { site } from '../data/site';
import { featuredProjects, latestPosts } from '../lib/content';
import { allPosts, allProjects } from '../lib/store';
import styles from './HomePage.module.css';

/** 首页：首屏身份 → 技能摘要（前 6 项）→ 精选项目 → 最新文章 → 联系区 */
export function HomePage() {
  const featured = featuredProjects(allProjects);
  const posts = latestPosts(allPosts);
  const skillSummary = skills
    .map((group) => ({ ...group, items: group.items.slice(0, 6) }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <section className={`container ${styles.hero} sectionIn`}>
        <div className={styles.heroText}>
          <p className={styles.role}>{site.role}</p>
          <h1 className={styles.name}>{site.name}</h1>
          <p className={styles.tagline}>{site.tagline}</p>
          <p className={styles.location}>
            {site.location}
            {site.availability ? ` · ${site.availability}` : ''}
          </p>
          <div className={styles.cta}>
            <Link to="/projects" className="btn btnPrimary">
              查看项目
            </Link>
            <ResumeButton />
          </div>
        </div>
        {/* 头像缺失：姓名首字色块占位 */}
        <div className={styles.avatar} aria-hidden="true">
          {site.name.slice(0, 1)}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">技能</h2>
          {skillSummary.map((group) => (
            <SkillGroup key={group.group} group={group} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="sectionTitle">精选项目</h2>
          {featured.length === 0 ? (
            <EmptyState message="项目正在整理中，欢迎先通过邮件了解我的工作。" actionLabel="联系我" actionHref="/#contact" />
          ) : (
            <div className={styles.grid}>
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 无已发布文章时整个区块隐藏，不出现空标题 */}
      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="sectionTitle">最新文章</h2>
            <div className={styles.postList}>
              {posts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className={`section ${styles.contact}`}>
        <div className={`container ${styles.contactInner}`}>
          <h2 className="sectionTitle">联系我</h2>
          <p className={styles.contactText}>对我的经历感兴趣，或想聊聊合作？邮件是最快的方式。</p>
          <CopyEmailButton />
        </div>
      </section>
    </>
  );
}
