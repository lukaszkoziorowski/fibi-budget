import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
      binaryInterval: 3000,
    },
    hmr: {
      overlay: true,
      clientPort: 5173,
      protocol: 'ws',
    },
    port: 5173,
    strictPort: true,
    host: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
    exclude: [],
  },
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
