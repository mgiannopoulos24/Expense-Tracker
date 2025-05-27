import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Use BASE_URL environment variable or default to '/'
  base: process.env.BASE_URL || '/',
  define: {
    // Make BASE_URL available to the client code
    'import.meta.env.BASE_URL': JSON.stringify(process.env.BASE_URL || '/'),
  }
})