/// <reference types="vitest/config" />

import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ Change defineConfig to accept a function (config environment)
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development', 'production')
  // The third argument '' loads all variables without a prefix restriction, 
  // but it's best practice to stick to the VITE_ prefix for client safety.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  // Use the loaded environment variable here
  const backendTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'; // Fallback is optional

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // Any request starting with /api will be proxied
        '/api': {
          // 💡 Reference the variable loaded from the .env file
          target: backendTarget,
          // Needed for virtual hosted sites
          changeOrigin: true,
          // Optional: Rewrite the path to remove '/api' before sending to backend
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // Vitest configuration (if present)
    test: {
      // Simulates a browser environment for React components
      environment: 'jsdom',
      // Run setup file before tests
      setupFiles: './vitest.setup.ts',
      // Enable global-like Jest matchers (describe, it, expect)
      globals: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      // 💡 This line tells Vitest to ignore files and directories
      exclude: ['node_modules', 'e2e', '**/e2e/**'],
    }
  };
});