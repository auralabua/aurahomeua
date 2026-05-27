import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
  build: {
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Enable minification
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React core — highest priority, always cached
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react/jsx-runtime") ||
              id.includes("node_modules/scheduler/")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run/")) {
            return "vendor-router";
          }
          // React Query
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }
          // Supabase
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase";
          }
          // All Radix UI together
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }
          // Charts (only used in admin)
          if (id.includes("node_modules/recharts") ||
              id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }
          // Other large utilities
          if (id.includes("node_modules/lucide-react/")) {
            return "vendor-icons";
          }
          // Admin pages in their own chunk
          if (id.includes("/pages/admin/")) {
            return "pages-admin";
          }
          // Blog pages
          if (id.includes("/pages/blog/")) {
            return "pages-blog";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
