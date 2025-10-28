import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy] Forwarding request: ${req.method} ${req.url}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy] Error:', err);
          });
        },
      },
    },
  },
})