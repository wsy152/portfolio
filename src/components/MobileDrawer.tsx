import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CloseIcon } from './icons';
import styles from './MobileDrawer.module.css';

interface MobileDrawerProps {
  open: boolean;
  showBlog: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

/** 全屏抽屉：打开时锁滚动、Esc 关闭、焦点陷阱，关闭后焦点回到汉堡按钮（由调用方处理） */
export function MobileDrawer({ open, showBlog, onClose }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    document.body.style.overflow = 'hidden';
    const drawer = drawerRef.current;
    drawer?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'Tab' && drawer) {
        const focusables = [...drawer.querySelectorAll<HTMLElement>(FOCUSABLE)];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div ref={drawerRef} id="mobile-drawer" className={styles.overlay} role="dialog" aria-modal="true" aria-label="导航菜单">
      <div className={styles.topBar}>
        <button type="button" className={styles.closeButton} aria-label="关闭导航菜单" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <nav className={styles.nav} aria-label="移动端导航">
        <Link to="/about" className={styles.navLink} onClick={onClose}>
          关于
        </Link>
        <Link to="/projects" className={styles.navLink} onClick={onClose}>
          项目
        </Link>
        {showBlog && (
          <Link to="/blog" className={styles.navLink} onClick={onClose}>
            博客
          </Link>
        )}
        <Link to="/#contact" className={styles.navLink} onClick={onClose}>
          联系我
        </Link>
      </nav>
    </div>
  );
}
