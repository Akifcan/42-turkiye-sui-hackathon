import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8765,
    strictPort: false,
  },
  build: {
    // Optimize for Walrus Sites deployment
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper chunking for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('@mysten')) {
              return 'sui';
            }
            return 'vendor-other';
          }
        },
      },
    },
  },
  // Enable SPA fallback for client-side routing
  preview: {
    port: 4173,
    strictPort: false,
  },
});
