import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site } from '../data/site';
import { MenuIcon } from './icons';
import { MobileDrawer } from './MobileDrawer';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  showBlog: boolean;
}

export function SiteHeader({ showBlog }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由切换时关闭抽屉
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          {site.name}
        </Link>
        <nav className={styles.nav} aria-label="主导航">
          <NavLink to="/about" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
            关于
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            项目
          </NavLink>
          {showBlog && (
            <NavLink to="/blog" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              博客
            </NavLink>
          )}
          {/* 联系区只存在于首页，跨页跳转必须带路径，否则锚点落空 */}
          <Link to="/#contact" className="btn btnPrimary">
            联系我
          </Link>
        </nav>
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-label="打开导航菜单"
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>
      <MobileDrawer
        open={drawerOpen}
        showBlog={showBlog}
        onClose={() => {
          setDrawerOpen(false);
          menuButtonRef.current?.focus();
        }}
      />
    </header>
  );
}
