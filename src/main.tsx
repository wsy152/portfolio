import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { BASE_PATH } from './lib/base';
import './styles/global.css';
import './styles/markdown.css';

const container = document.getElementById('root')!;
const app = (
  <BrowserRouter basename={BASE_PATH}>
    <App />
  </BrowserRouter>
);

/** 当前路由（去掉 base 前缀） */
function currentPath(): string {
  const base = BASE_PATH.replace(/\/$/, '');
  const full = window.location.pathname;
  return base && full.startsWith(base) ? full.slice(base.length) || '/' : full;
}

/**
 * 预渲染的详情页 HTML 由懒加载 chunk 渲染。若 hydrate 时 chunk 还没就绪，
 * Suspense fallback 会与服务端 HTML 不一致并报 hydration 失败（#418）。
 * 因此只对当前命中的详情路由预载对应 chunk，其余页面不受影响。
 */
async function preloadRouteChunk(): Promise<void> {
  const path = currentPath();
  if (/^\/projects\/[^/]+\/?$/.test(path)) {
    await import('./pages/ProjectDetailPage');
  } else if (/^\/blog\/[^/]+\/?$/.test(path)) {
    await import('./pages/BlogDetailPage');
  }
}

async function boot(): Promise<void> {
  if (container.firstElementChild) {
    // 生产构建：接管预渲染 HTML
    await preloadRouteChunk();
    hydrateRoot(container, app);
  } else {
    // 开发环境：index.html 的 #root 为空，用 createRoot 才不会报 hydration 失败
    createRoot(container).render(app);
  }
}

void boot();
