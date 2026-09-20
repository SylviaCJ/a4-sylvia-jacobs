import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/data': 'http://localhost:3001',
      '/delete': 'http://localhost:3001',
      '/edit': 'http://localhost:3001',
    },
  },
})
