import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa', // 👈 ensures React Router deep links (e.g. /privacy-policy) work
  server: {
    proxy: {
      "/api": "http://localhost:3001", // proxy all /api calls to backend
    },
  },
});
