import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'error', // Suppress warnings, only show errors
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/pages', replacement: path.resolve(__dirname, 'src/page') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/go': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
