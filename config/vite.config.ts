import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'Invisioned Marketing',
    //     short_name: 'InvisionedMkt',
    //     description: 'Invisioned Marketing Web Application',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.yourbackend\.com\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'api-cache',
    //           expiration: {
    //             maxEntries: 10,
    //             maxAgeSeconds: 60 * 60 * 24 // 24 hours
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200]
    //           }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:png|gif|jpg|jpeg|svg)$/i,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'images',
    //           expiration: {
    //             maxEntries: 50,
    //             maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
    //           }
    //         }
    //       }
    //     ]
    //   }
    // })
  ],
  optimizeDeps: {
    include: ['virtual:pwa-register'],
    exclude: ['lucide-react']
  },
  build: {
    rollupOptions: {
      input: {
        main: 'src/main.tsx',
      },
    },
    minify: 'esbuild',
  },
  // Vite automatically minifies and bundles assets by default
  // The server should be configured to serve compressed files (Gzip/Brotli)
  // The server should be configured to serve over HTTPS
  server: {
    port: 3000,
  },
});
