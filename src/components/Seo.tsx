import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveMeta } from '../lib/seo';

/** 客户端路由切换时更新 title 与 description（静态 HTML 由预渲染注入） */
export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const meta = resolveMeta(location.pathname);
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', meta.description);
  }, [location.pathname]);

  return null;
}
