import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { SiteLayout } from './layouts/SiteLayout';
import { AboutPage } from './pages/AboutPage';
import { BlogListPage } from './pages/BlogListPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProjectListPage } from './pages/ProjectListPage';

// 详情页路由级懒加载：正文数据（virtual:content-bodies）随这两个 chunk 按需加载
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));

/** 唯一路由表：客户端与预渲染共用，禁止在两处各写一套 */
export function AppRoutes() {
  return (
    <Route element={<SiteLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="projects" element={<ProjectListPage />} />
      <Route path="projects/:slug" element={<ProjectDetailPage />} />
      <Route path="blog" element={<BlogListPage />} />
      <Route path="blog/:slug" element={<BlogDetailPage />} />
      <Route path="404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  );
}
