"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }





var _chunkADZICLDIjs = require('./chunk-ADZICLDI.js');


var _chunkICQFTZDUjs = require('./chunk-ICQFTZDU.js');

// src/node/cli.ts
var _cac = require('cac'); var _cac2 = _interopRequireDefault(_cac);
var _path = require('path');

// src/node/build.ts
var _vite = require('vite');

var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _url = require('url');
async function bunlde(root, config) {
  try {
    const resolveViteConfig = async (isServer) => {
      return {
        mode: "production",
        root,
        plugins: await _chunkADZICLDIjs.createVitePlugins.call(void 0, config, null, isServer),
        ssr: {
          noExternal: ["react-router-dom", "lodash-es"]
        },
        build: {
          minify: false,
          outDir: isServer ? _path.join.call(void 0, root, ".temp") : _path.join.call(void 0, root, _chunkADZICLDIjs.CLIENT_OUTPUT),
          ssr: isServer,
          rollupOptions: {
            input: isServer ? _chunkADZICLDIjs.SERVER_ENTRY_PATH : _chunkADZICLDIjs.CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return await _vite.build.call(void 0, await resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return await _vite.build.call(void 0, await resolveViteConfig(true));
    };
    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    const publicDir = _path.join.call(void 0, root, "public");
    if (_fsextra2.default.pathExistsSync(publicDir)) {
      await _fsextra2.default.copy(publicDir, _path.join.call(void 0, root, _chunkADZICLDIjs.CLIENT_OUTPUT));
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
      await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build", _path.dirname.call(void 0, fileName)));
      await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build", fileName), html);
    })
  );
}
async function build(root, config) {
  const [clientBundle] = await bunlde(root, config);
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render, routes } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath).toString())));
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
  return _vite.build.call(void 0, {
    mode: "production",
    build: {
      outDir: _path.join.call(void 0, root, ".temp"),
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
          if (id.includes(_chunkADZICLDIjs.MASK_SPLITTER)) {
            const [originId, importor] = id.split(_chunkADZICLDIjs.MASK_SPLITTER);
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
var cli = _cac2.default.call(void 0, "island").version("0.0.0").help();
cli.command("dev [root]", "start dev server").action(async (root) => {
  root = root ? _path.resolve.call(void 0, root) : process.cwd();
  const createServer = async () => {
    const { createDevServer } = await Promise.resolve().then(() => _interopRequireWildcard(require("./dev.js")));
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
    root = _path.resolve.call(void 0, root);
    const config = await _chunkICQFTZDUjs.resolveConfig.call(void 0, root, "build", "production");
    await build(root, config);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
