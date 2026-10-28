import { Link } from 'react-router-dom';
import { SkillGroup } from '../components/SkillGroup';
import { Timeline } from '../components/Timeline';
import { CopyEmailButton } from '../components/CopyEmailButton';
import { skills } from '../data/skills';
import { currentFocus, education, experiences, site } from '../data/site';

/** 关于页：完整介绍 → 经历时间线 → 教育 → 当前在做什么 → 联系方式 */
export function AboutPage() {
  return (
    <div className="container section" style={{ maxWidth: 'var(--prose)' }}>
      <h1 style={{ fontSize: '30px', marginBottom: 'var(--space-4)' }}>关于</h1>

      <section style={{ marginBottom: 'var(--space-6)' }}>
        <p>
          我是{site.name}，{site.tagline}。目前{site.availability ?? site.role}，坐标{site.location}。
        </p>
        <p>
          我相信工程判断比技术清单更重要：每个项目为什么这么做、舍弃了什么、结果如何验证，
          这些过程信息都写在了<Link to="/projects">项目页</Link>里。
        </p>
        <p>工作之外，我把实践整理成文章，持续输出。</p>
      </section>

      {experiences.length > 0 && (
        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="sectionTitle">经历</h2>
          <Timeline items={experiences} />
        </section>
      )}

      <section style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="sectionTitle">技能</h2>
        {skills.map((group) => (
          <SkillGroup key={group.group} group={group} />
        ))}
      </section>

      <section style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="sectionTitle">教育</h2>
        <ul>
          {education.map((item) => (
            <li key={item.school} style={{ marginBottom: 'var(--space-2)' }}>
              <strong>{item.school}</strong> · {item.major} ·{' '}
              <span style={{ color: 'var(--muted)' }}>{item.period}</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="sectionTitle">当前在做什么</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: 'var(--space-4)' }}>
          {currentFocus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="sectionTitle">联系方式</h2>
        <CopyEmailButton />
      </section>
    </div>
  );
}
