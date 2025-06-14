import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import gitRevisionVitePlugin from 'git-revision-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

const addr = '127.0.0.1:50000';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    gitRevisionVitePlugin(),
    sentryVitePlugin({
      org: 'sereindev',
      project: 'web',
      telemetry: false,
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/api': 'http://' + addr,
      '/ws/server': {
        target: 'ws://' + addr,
        changeOrigin: true,
        ws: true,
      },
      '/ws/connection': {
        target: 'ws://' + addr,
        changeOrigin: true,
        ws: true,
      },
    },
    port: 50001,
  },

  build: {
    sourcemap: true,
  },
});
