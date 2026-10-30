import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const PHASER = file("./node_modules/phaser/build/custom/phaser-custom.js");
const PIXI = file("./node_modules/phaser/build/custom/pixi-custom.js");
await buildPhaser();

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
      "@": file("./src"),
      pixi: PIXI,
      phaser: PHASER,
      "@azerion/phaser-super-storage": file(
        "./node_modules/@azerion/phaser-super-storage/build/phaser-super-storage.js",
      ),
    },
  },
});

function file(name: string) {
  return fileURLToPath(new URL(name, import.meta.url));
}

async function buildPhaser() {
  if (fs.existsSync(PHASER) && fs.existsSync(PIXI)) return;
  const phaserModules = [
    "phaser",
    "pixi-rope",
    "pixi-tilesprite",
    "geom",
    "core",
    "input",
    "gamepad",
    "keyboard",
    "components",
    "gameobjects",
    "bitmapdata",
    "graphics",
    "rendertexture",
    "text",
    "bitmaptext",
    "retrofont",
    "rope",
    "tilesprite",
    "system",
    "math",
    "net",
    "tweens",
    "time",
    "animation",
    "loader",
    "sound",
    "scale",
    "debug", // exclude in prod?
    "dom",
    "utils",
    "create",
    "flexgrid",
    "color",
    "physics",
    "tilemaps",
    "particles",
    "video",
    "pixidefs",
    "exports",
  ];
  await buildModules(PHASER, phaserModules);

  const pixiModules = ["pixi-main"];
  await buildModules(PIXI, pixiModules);
}

async function buildModules(outfile: string, modules: string[]) {
  const modulePath = "./node_modules/phaser/dist/modules/";
  const outputStream = fs.createWriteStream(outfile);
  try {
    for (const module of modules) {
      const inputStream = fs.createReadStream(
        file(modulePath + module + ".js"),
      );
      await pipeline(inputStream, outputStream, { end: false });
    }
    outputStream.end();
  } catch (err) {
    console.error(err);
    outputStream.destroy(err instanceof Error ? err : new Error(err + ""));
  }
}
