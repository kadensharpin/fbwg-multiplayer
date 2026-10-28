import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: process.cwd(),
  base: "/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
