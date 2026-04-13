import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "clippi-192x192.png", "clippi-512x512.png"],
      manifest: {
        name: "Clippi",
        short_name: "Clippi",
        description: "테크 뉴스 큐레이션 & 북마크 관리",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "clippi-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "clippi-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
    {
      src: "screenshot-desktop.png",
      sizes: "2560x1440",
      type: "image/png",
      form_factor: "wide",
      label: "Clippi 데스크톱",
    },
    {
      src: "screenshot-mobile.png",
      sizes: "1170x2532",
      type: "image/png",
      form_factor: "narrow",
      label: "Clippi 모바일",
    },
  ],
      },
    }),
  ],
});