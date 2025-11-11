import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "foodie-zen.onrender.com",
      ".onrender.com", // allow any onrender subdomain
      "localhost",
      "127.0.0.1",
    ],
  },

  preview: {
    host: "0.0.0.0",
    port: 8080,
    // Two safe options: list hosts (preferred) or set `allowedHosts: true` to disable checking
    allowedHosts: [
      "foodie-zen.onrender.com",
      ".onrender.com",
      "localhost",
      "127.0.0.1",
    ],
    // If you still hit host blocks, change the above to: allowedHosts: true,
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
