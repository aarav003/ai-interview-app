import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // FIX: In Vite, process.env is not available in the browser by default.
    // We define a replacement for it here, populating it with values from the build environment.
    'process.env': {
      API_KEY: process.env.API_KEY,
      VITE_WEBHOOK_URL: process.env.VITE_WEBHOOK_URL,
    }
  }
})
