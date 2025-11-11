import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // 1. MUST bind to 0.0.0.0 on Render for external access
    host: '0.0.0.0', 
    port: 8080,
    // 2. THIS IS THE CRUCIAL FIX FOR THE "BLOCKED REQUEST" ERROR
    allowedHosts: [
      'foodie-zen.onrender.com', 
      'localhost', 
      '127.0.0.1', 
    ],
  },
  
  // Keep the 'preview' block if you ever switch to the recommended production server
  preview: {
    host: '0.0.0.0',
    port: 4173,
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
