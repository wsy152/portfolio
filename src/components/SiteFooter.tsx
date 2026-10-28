import { site } from '../data/site';
import { CopyEmailButton } from './CopyEmailButton';
import { ExternalLink } from './ExternalLink';
import styles from './SiteFooter.module.css';

/** 页脚：联系方式、社交链接、版权与构建信息。构建年份为构建期常量。 */
export function SiteFooter() {
  const buildYear = __BUILD_YEAR__;
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.info}>
            <CopyEmailButton className={styles.email} />
            <span className={styles.meta} style={{ margin: 0 }}>
              {site.location} · {site.availability ?? site.role}
            </span>
          </div>
          <div className={styles.links}>
            {site.social.map((item) => (
              <ExternalLink key={item.label} href={item.href} className={styles.link}>
                {item.label}
              </ExternalLink>
            ))}
          </div>
        </div>
        <p className={styles.meta}>
          © {buildYear} {site.name} · 由 Vite 静态构建
        </p>
      </div>
    </footer>
  );
}
