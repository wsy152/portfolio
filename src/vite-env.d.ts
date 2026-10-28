/// <reference types="vite/client" />

/** 构建年份（构建期注入的常量，避免客户端 new Date 造成 hydration mismatch） */
declare const __BUILD_YEAR__: number;

declare module 'virtual:content' {
  import type { ContentSummaries } from './lib/schema';
  const data: ContentSummaries;
  export default data;
}

declare module 'virtual:content-bodies' {
  import type { ContentBodies } from './lib/schema';
  const data: ContentBodies;
  export default data;
}
