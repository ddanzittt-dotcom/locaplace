import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import { defineConfig } from "vitest/config"

const manualChunkGroups = [
  { name: "react", packages: ["react", "react-dom", "react-router-dom"] },
  { name: "supabase", packages: ["@supabase/supabase-js"] },
  {
    name: "vendor",
    packages: ["@hookform/resolvers", "@tanstack/react-query", "react-hook-form", "zod"],
  },
] as const

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      includeAssets: ["favicon.svg", "pwa-192.svg", "pwa-512.svg"],
      manifest: {
        name: "LOCA",
        short_name: "LOCA",
        description: "장소를 기록하고 취향 지도로 나누는 모바일 PWA",
        theme_color: "#101310",
        background_color: "#101310",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/home",
        icons: [
          {
            src: "/pwa-192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "/pwa-512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      registerType: "autoUpdate",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id): string | undefined {
          const normalizedId = id.replaceAll("\\", "/")
          if (!normalizedId.includes("/node_modules/")) return undefined

          for (const group of manualChunkGroups) {
            const hasMatchingPackage = group.packages.some((packageName) =>
              normalizedId.includes(`/node_modules/${packageName}/`),
            )
            if (hasMatchingPackage) return group.name
          }

          return undefined
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", "dist/**"],
  },
})
