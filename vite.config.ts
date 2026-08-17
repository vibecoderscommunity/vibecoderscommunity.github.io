import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import contentPlugin from './scripts/content-plugin.js'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [vue(), contentPlugin()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    // The client bundle is what Cloudflare serves as static assets; the SSR
    // bundle is only used by `scripts/prerender.js` at build time.
    outDir: isSsrBuild ? 'dist/server' : 'dist/client',
    emptyOutDir: true,
    ssr: isSsrBuild ? 'src/entry-server.ts' : undefined,
    rollupOptions: isSsrBuild ? { input: 'src/entry-server.ts' } : undefined,
    // Event posters are large; keep everything as a real file so the CDN and
    // the browser cache can do their job.
    assetsInlineLimit: 0,
    sourcemap: false,
  },

  server: {
    // Proxy the newsletter endpoint to `wrangler dev` so the form works the
    // same way in `vite dev` as it does in production.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
}))
