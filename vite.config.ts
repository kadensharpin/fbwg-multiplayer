import Path from "node:path";
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
      "phaser-box2d": Path.resolve(
        __dirname,
        "node_modules/phaser-box2d/dist/PhaserBox2D.js",
      ),
    },
  },
});
