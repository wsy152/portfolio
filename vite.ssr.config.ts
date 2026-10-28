import { defineConfig } from 'vite';
import { contentPlugin } from './scripts/content-plugin';
import { BASE_PATH } from './src/lib/base';

// SSR 构建：产出 Node 可执行的 entry-server，供 scripts/prerender.ts 调用
export default defineConfig({
  base: BASE_PATH,
  plugins: [contentPlugin()],
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    ssr: true,
    outDir: 'dist-ssr',
    rollupOptions: {
      input: 'src/entry-server.tsx',
      output: {
        format: 'esm',
        entryFileNames: 'entry-server.js',
      },
    },
  },
});
