import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Crucial for Render to bind correctly
    host: '0.0.0.0', 
    port: 8080,
  },
  
  // THIS IS THE BLOCK THAT FIXES THE "BLOCKED REQUEST" ERROR
  preview: {
    // Must listen on 0.0.0.0 to accept external requests on Render
    host: '0.0.0.0',
    // Set a port, Render will typically overwrite this via the $PORT env var
    port: 4173,
    // Explicitly allow the blocked domain, plus local testing hosts
    allowedHosts: [
      'foodie-zen.onrender.com', 
      'localhost', 
      '127.0.0.1', 
    ], 
  },
  
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
