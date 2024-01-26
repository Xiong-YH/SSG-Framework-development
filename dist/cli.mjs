import {
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  createVitePlugins
} from "./chunk-X63OVSG2.mjs";
import {
  resolveConfig
} from "./chunk-DGIDFQB4.mjs";

// src/node/cli.ts
import cac from "cac";
import { resolve } from "path";

// src/node/build.ts
import { build as viteBuild } from "vite";
import { dirname, join } from "path";
import fs from "fs-extra";
import { pathToFileURL } from "url";
async function bunlde(root, config) {
  try {
    const resolveViteConfig = async (isServer) => {
      return {
        mode: "production",
        root,
        plugins: await createVitePlugins(config, isServer),
        ssr: {
          noExternal: ["react-router-dom"]
        },
        build: {
          minify: false,
          outDir: isServer ? join(root, ".temp") : join(root, "build"),
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
      return await viteBuild(await resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return await viteBuild(await resolveViteConfig(true));
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
async function renderPage(render, root = process.cwd(), clientBundle, routes) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  console.log("Rendering page in server side...");
  return Promise.all(
    routes.map(async (route) => {
      const appHtml = render(route.path);
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
      const fileName = route.path.endsWith("/") ? `${route.path}index.html` : `${route.path}.html`;
      await fs.ensureDir(join(root, "build", dirname(fileName)));
      await fs.writeFile(join(root, "build", fileName), html);
    })
  );
}
async function build(root, config) {
  const [clientBundle] = await bunlde(root, config);
  const serverEntryPath = join(root, ".temp", "ssr-entry.js");
  const { render, routes } = await import(pathToFileURL(serverEntryPath).toString());
  try {
    await renderPage(render, root, clientBundle, routes);
  } catch (error) {
    console.log("Render page error.\n", error);
  }
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
    const config = await resolveConfig(root, "build", "production");
    await build(root, config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
