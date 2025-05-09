import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@auth": fileURLToPath(new URL("./src/features/auth", import.meta.url)),
      "@admin": fileURLToPath(new URL("./src/features/admin", import.meta.url)),
      "@env": fileURLToPath(new URL("./src/env", import.meta.url)),
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
    },
  },
  server: {
    port: 3011,
    open: true,
  },
  build: {
    outDir: "./build",
  },
});
