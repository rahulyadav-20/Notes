import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Babel fast-refresh stays on; explicit JSX transform avoids unnecessary re-renders
      jsxRuntime: 'automatic',
    }),
    tailwindcss(),
  ],

  build: {
    // Split vendor deps into their own chunk so app code can be cached separately
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor'
          }
          if (id.includes('node_modules/zustand')) {
            return 'zustand-vendor'
          }
        },
      },
    },
    // Warn if a chunk exceeds 500 KB
    chunkSizeWarningLimit: 500,
  },

  // Pre-bundle heavy deps in dev so the browser gets fewer round trips
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'axios'],
  },
})
