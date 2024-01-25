import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH
} from "./chunk-2IFRJ42P.mjs";
import "./chunk-JIN4FLKK.mjs";

// src/node/cli.ts
import cac from "cac";
import { resolve } from "path";

// src/node/build.tsx
import { build as viteBuild } from "vite";
import { join } from "path";
import fs from "fs-extra";
import pluginReact from "@vitejs/plugin-react";
import { pathToFileURL } from "url";
async function bunlde(root) {
  try {
    const resolveViteConfig = (isServer) => {
      return {
        mode: "production",
        root,
        plugins: [pluginReact()],
        build: {
          outDir: isServer ? ".temp" : "build",
          ssr: isServer,
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    return [clientBundle, serverBundle];
  } catch (error) {
    console.log(error);
  }
}
async function build(root) {
  const [clientBundle, serverBundle] = await bunlde(root);
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  await renderPage(render, root, clientBundle);
}
async function renderPage(render, root, clientBundle) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log("Rendering page in server side...");
  const appHtml = render();
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="${clientChunk.fileName}"></script>
    </body>
    </html>
    `.trim();
  await fs.writeFile(join(root, "build", "index.html"), html);
  await fs.remove(join(root, ".temp"));
}

// src/node/cli.ts
var cli = cac("island").version("0.0.0").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  root = root ? resolve(root) : process.cwd();
  const createServer = async () => {
    const { createDevServer } = await import("./dev.mjs");
    const server = await createDevServer(root, async () => {
      await server.close();
      await createServer();
    });
    await server.listen();
    server.printUrls();
  };
  await createServer();
});
cli.command("build [root]", "build in production").action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
