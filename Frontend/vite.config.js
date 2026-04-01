import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const backendUrl = env.VITE_APP_URL?.replace(/\/$/, "")

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: backendUrl
      ? {
          proxy: {
            "/api": {
              target: backendUrl,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    preview: backendUrl
      ? {
          proxy: {
            "/api": {
              target: backendUrl,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
  }
})
