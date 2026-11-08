import { cloudflare } from "@cloudflare/vite-plugin";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { type CommonServerOptions, defineConfig } from "vite";

const PHASER = file("./node_modules/phaser/build/custom/phaser-custom.js");
const PIXI = file("./node_modules/phaser/build/custom/pixi-custom.js");
await buildPhaser();

const proxies = [
  [
    "forest",
    "https://html5.gamedistribution.com/rvvASMiM/a55c9cc9c21e4fc683c8c6857f3d0c75",
  ],
  [
    "light",
    "https://html5.gamedistribution.com/rvvASMiM/383ad09b92c7446b9113cccc29630517",
  ],
  [
    "ice",
    "https://html5.gamedistribution.com/rvvASMiM/f3a6e1ac0a77412289cbac47658b2b68",
  ],
  [
    "crystal",
    "https://html5.gamedistribution.com/rvvASMiM/3790681b69584409b7f681a8e400102d",
  ],
  [
    "elements",
    "https://html5.gamedistribution.com/rvvASMiM/03f124074b0049f89fdace0cacf8ead5",
  ],
  [
    "fairytales",
    "https://html5.gamedistribution.com/rvvASMiM/56da8a54fe204845b34ccff750d4a60b",
  ],
  [
    "friends",
    "https://html5.gamedistribution.com/rvvASMiM/d4a3629101574bc39bd8f9d1888ca58e",
  ],
] as const;

export default defineConfig({
  root: process.cwd(),
  base: "/",
  server: {
    port: 3000,
    open: true,
    proxy: proxies.reduce(
      (p, [version, proxyUrl]) => {
        p["/" + version] = {
          target: proxyUrl,
          changeOrigin: true,
          prependPath: false,
          rewrite: (path) => path.slice(version.length + 1),
          fetch: async (req, init) => {
            let requestPath: string;
            if (req instanceof Request) {
              requestPath = new URL(req.url).pathname;
            } else if (req instanceof URL) {
              requestPath = req.pathname;
            } else {
              requestPath = new URL(req).pathname;
            }
            const path = file("./public/" + version + requestPath);
            if (await exists(path)) {
              const headers = new Headers();
              if (init?.headers) {
                const accept = new Headers(init.headers).get("Accept");
                if (accept) headers.append("Content-Type", accept);
              }
              return new Response(await readFile(path), {
                status: 200,
                headers,
              });
            }
            const requestUrl = proxyUrl + requestPath;
            console.log("Caching", requestUrl, path);
            return fetch(proxyUrl + requestPath, init).then(async (res) => {
              const headers = new Headers(res.headers);
              headers.delete("content-encoding");
              const bytes = await res.bytes();
              if (res.ok) {
                mkdir(path.slice(0, path.lastIndexOf("/")), {
                  recursive: true,
                }).then(() => writeFile(path, bytes));
              }
              return new Response(bytes, { status: res.status, headers });
            });
          },
        };
        return p;
      },
      {} as CommonServerOptions["proxy"] & {},
    ),
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
  plugins: [cloudflare({ configPath: file("cloudflare/wrangler.jsonc") })],
});

function file(name: string) {
  return fileURLToPath(new URL(name, import.meta.url));
}

async function buildPhaser() {
  if ((await exists(PHASER)) && (await exists(PIXI))) return;
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
  const outputStream = createWriteStream(outfile);
  try {
    for (const module of modules) {
      const inputStream = createReadStream(file(modulePath + module + ".js"));
      await pipeline(inputStream, outputStream, { end: false });
    }
    outputStream.end();
  } catch (err) {
    console.error(err);
    outputStream.destroy(err instanceof Error ? err : new Error(err + ""));
  }
}

async function exists(file: string) {
  const stats = await stat(file, { throwIfNoEntry: false });
  return !!stats?.isFile();
}
