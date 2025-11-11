import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Render typically needs the server to listen on all network interfaces
    host: '0.0.0.0', 
    // Render provides the PORT as an environment variable
    port: Number(process.env.PORT) || 8080, 
    // You can remove the allowedHosts if 0.0.0.0 fix works, but adding it doesn't hurt.
  },
  
  // ADD THIS BLOCK
  preview: {
    host: '0.0.0.0', // Ensure preview server also binds to 0.0.0.0
    port: Number(process.env.PORT) || 4173, // Default Vite preview port is 4173
    // Explicitly allow the domain, though 0.0.0.0 often makes this redundant.
    allowedHosts: ['foodie-zen.onrender.com', 'localhost', '127.0.0.1'], 
  },
  // END OF ADDED BLOCK

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
