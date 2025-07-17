// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log("✅ Vite config loaded..."); // test log
console.log("✅ vite.config.js is running...");


export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
});

