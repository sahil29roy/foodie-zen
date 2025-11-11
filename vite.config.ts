import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // The 'server' block is for local development
  server: {
    host: '0.0.0.0', // Bind to all interfaces locally for better compatibility
    port: 8080,
  },
  
  // The 'preview' block is used by 'bun run preview' (your Start Command)
  preview: {
    // 1. Tell the server to listen on all public network interfaces
    host: '0.0.0.0',
    // 2. Set an explicit port
    port: 4173,
    // 3. Explicitly allow the domain that was blocked
    allowedHosts: [
      'foodie-zen.onrender.com', 
      'localhost', 
    ], 
  },
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
