import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "icon-192.png", "icon-512.png"],
      manifest: {
        name: "BodyHome — Товари для здоров'я",
        short_name: "BodyHome",
        description: "Ортопедичні подушки, масажери, устілки, бандажі. Доставка Новою Поштою по всій Україні.",
        theme_color: "#3d7a55",
        background_color: "#f7f3ee",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        lang: "uk",
        dir: "ltr",
        categories: ["shopping", "health"],
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "og-image.jpg",
            sizes: "1200x630",
            type: "image/jpeg",
            form_factor: "wide",
            label: "BodyHome — Товари для здоров'я",
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        // Pre-cache all build assets
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // Don't pre-cache large chart vendor (admin-only)
        globIgnores: ["**/vendor-charts*"],
        runtimeCaching: [
          // Product images from prom.ua — CacheFirst, 30 days
          {
            urlPattern: /^https:\/\/images\.prom\.ua\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "product-images-prom",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Vercel optimized images — CacheFirst, 7 days
          {
            urlPattern: /^\/_vercel\/image.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "vercel-optimized-images",
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Pexels (hero image) — CacheFirst, 30 days
          {
            urlPattern: /^https:\/\/images\.pexels\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "hero-images",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Supabase API — NetworkFirst (fresh data), 5 min cache
          {
            urlPattern: /^https:\/\/gpaeevehxwrczhdozifd\.supabase\.co\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 8,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts — CacheFirst, 1 year
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Navigate fallback for SPA routing
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/admin/, /^\/api/, /^\/_vercel/],
      },
      // Dev mode: enable SW in development for testing
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
  build: {
    target: "es2020",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/jsx-runtime") ||
            id.includes("node_modules/scheduler/")
          ) return "vendor-react";
          if (id.includes("node_modules/react-router") || id.includes("node_modules/@remix-run/"))
            return "vendor-router";
          if (id.includes("node_modules/@tanstack/")) return "vendor-query";
          if (id.includes("node_modules/@supabase/")) return "vendor-supabase";
          if (id.includes("node_modules/@radix-ui/")) return "vendor-radix";
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-"))
            return "pages-admin";
          if (id.includes("node_modules/lucide-react/")) return "vendor-icons";
          if (id.includes("/pages/admin/")) return "pages-admin";
          if (id.includes("/pages/blog/")) return "pages-blog";
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
