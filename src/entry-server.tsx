import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { BASE_PATH } from './lib/base';
import { renderHead, resolveMeta } from './lib/seo';
import './styles/global.css';
import './styles/markdown.css';

export interface RenderResult {
  app: string;
  head: string;
}

/**
 * SSR 入口：按 URL 渲染应用并解析对应 head 元信息。
 * 详情页是懒加载 chunk，必须用 renderToPipeableStream + onAllReady 等待 Suspense 就绪。
 */
export function render(url: string): Promise<RenderResult> {
  return new Promise((resolvePromise, reject) => {
    let app = '';
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        app += chunk.toString();
        callback();
      },
    });
    sink.on('finish', () => {
      resolvePromise({ app, head: renderHead(resolveMeta(url)) });
    });
    const { pipe } = renderToPipeableStream(
      <StaticRouter location={url} basename={BASE_PATH}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          pipe(sink);
        },
        onError(error) {
          reject(error);
        },
      },
    );
  });
}
