import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { SiteFooter } from '../components/SiteFooter';
import { SiteHeader } from '../components/SiteHeader';
import { focusPageHeading } from '../lib/focus';
import { allPosts } from '../lib/store';

/** 页面骨架：跳转链接 + 导航 + 主内容 + 页脚；路由切换后处理锚点与焦点 */
export function SiteLayout() {
  const location = useLocation();
  const { pathname, hash } = location;

  useEffect(() => {
    if (hash) {
      // 跨页锚点（如首页 #contact）在渲染完成后才存在，需等一帧再滚动
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
    focusPageHeading();
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skipLink">
        跳到主要内容
      </a>
      <Seo />
      <SiteHeader showBlog={allPosts.length > 0} />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
