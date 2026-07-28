import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { aiProxyPlugin } from "./plugins/vite-plugin-ai-proxy"
import { bilibiliProxyPlugin } from "./plugins/vite-plugin-bilibili-proxy"

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), aiProxyPlugin(), bilibiliProxyPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
