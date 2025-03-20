import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'; // Import the Node.js path module
import { fileURLToPath } from 'node:url'; // Import to define __dirname

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Maps @ to src directory
    },
  },
})
