import { Link } from 'react-router-dom';
import type { SkillGroup as SkillGroupData } from '../data/skills';
import styles from './SkillGroup.module.css';

interface SkillGroupProps {
  group: SkillGroupData;
}

/** 技能分组：标签可点击跳转到项目列表并预置筛选条件；用例说明移动端常显 */
export function SkillGroup({ group }: SkillGroupProps) {
  if (group.items.length === 0) {
    return null;
  }
  return (
    <div className={styles.group}>
      <h3 className={styles.groupTitle}>{group.group}</h3>
      <ul className={styles.items}>
        {group.items.map((item) => (
          <li key={item.name} className={styles.item}>
            <Link to={`/projects?tag=${encodeURIComponent(item.name)}`} className={styles.tag}>
              {item.name}
            </Link>
            <span className={styles.usage}>{item.usage}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
