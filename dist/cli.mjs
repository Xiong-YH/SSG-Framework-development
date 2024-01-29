import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  MASK_SPLITTER,
  SERVER_ENTRY_PATH,
  createVitePlugins
} from "./chunk-2FPK5VL4.mjs";
import {
  resolveConfig
} from "./chunk-KSFXWFDG.mjs";

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
        plugins: await createVitePlugins(config, null, isServer),
        ssr: {
          noExternal: ["react-router-dom", "lodash-es"]
        },
        build: {
          minify: false,
          outDir: isServer ? join(root, ".temp") : join(root, CLIENT_OUTPUT),
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
    const publicDir = join(root, "public");
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }
    return [clientBundle, serverBundle];
  } catch (error) {
    console.log(error);
  }
}
async function renderPage(render, root = process.cwd(), clientBundle, routes) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
  debugger;
  console.log("Rendering page in server side...");
  return Promise.all(
    routes.map(async (route) => {
      const result = await render(route.path);
      const { appHtml, islandPathToMap, propsData = [] } = result;
      const islandBundle = await buildIsland(root, islandPathToMap);
      const islandCode = islandBundle.output[0].code;
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === "asset" && chunk.fileName.endsWith(".css")
      );
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          ${styleAssets.map((item) => `<link rel="stylesheet" href="/${item.fileName}">`).join("\n")}
      </head>
      <body>
          <div id="root">${appHtml}</div>
          <script type="module">${islandCode}</script>
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
async function buildIsland(root, islandPathToMap) {
  const islandInjectCode = `
    ${Object.entries(islandPathToMap).map(
    ([islandId, islandPath]) => `import {${islandId}} from '${islandPath}'`
  ).join("")}
    window.ISLAND=${Object.keys(islandPathToMap).join(",")}
    window.ISLAND_PROPS = JSON.parse(
      document.getElementById('island-props').textContent
    )
  `;
  const inject = "island:inject";
  return viteBuild({
    mode: "production",
    build: {
      outDir: join(root, ".temp"),
      rollupOptions: {
        input: inject
      }
    },
    plugins: [
      {
        name: "island:inject",
        enforce: "post",
        //构建之后使用的插件
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importor] = id.split(MASK_SPLITTER);
            return this.resolve(originId, importor, { skipSelf: true });
          }
          if (id === inject) {
            return id;
          }
        },
        //
        load(id) {
          if (id === inject) {
            return islandInjectCode;
          }
        },
        //打包产物不加入静态资源文件,只需要JS
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === "asset") {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
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
