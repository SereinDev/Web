import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import GitRevisionVitePlugin from 'git-revision-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), GitRevisionVitePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:30000/',
    },
  },
});
