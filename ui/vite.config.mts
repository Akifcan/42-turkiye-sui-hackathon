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
  },
  // Enable SPA fallback for client-side routing
  preview: {
    port: 4173,
    strictPort: false,
  },
});
