import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { contentPlugin } from './scripts/content-plugin';
import { BASE_PATH } from './src/lib/base';

export default defineConfig({
  base: BASE_PATH,
  plugins: [react(), contentPlugin()],
  define: {
    __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
