import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', 
  server: {
    host: true, // Exposes the server to the network (required for some cloud IDEs)
  },
  preview: {
    host: true, // Exposes the production preview
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false, 
    minify: 'esbuild', 
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'], 
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})