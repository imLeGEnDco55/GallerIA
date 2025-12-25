import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'app-icon.jpg', 'placeholder.svg'],
      manifest: {
        name: 'Galer.IA',
        short_name: 'Galer.IA',
        description: 'Tu colección personal de prompts para IA',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: 'icons/icon-192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'icons/icon-512.webp',
            sizes: '512x512',
            type: 'image/webp'
          },
          {
            src: 'icons/icon-512.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
}));
