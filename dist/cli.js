"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }



var _chunkC3FDWALXjs = require('./chunk-C3FDWALX.js');


var _chunkICQFTZDUjs = require('./chunk-ICQFTZDU.js');

// src/node/cli.ts
var _cac = require('cac'); var _cac2 = _interopRequireDefault(_cac);
var _path = require('path');

// src/node/build.ts
var _vite = require('vite');

var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
var _url = require('url');
async function bunlde(root, config) {
  try {
    const resolveViteConfig = (isServer) => {
      return {
        mode: "production",
        root,
        plugins: [_pluginreact2.default.call(void 0, ), _chunkC3FDWALXjs.pluginConfig.call(void 0, config)],
        ssr: {
          noExternal: ["react-router-dom"]
        },
        build: {
          minify: false,
          outDir: isServer ? _path.join.call(void 0, root, ".temp") : "build",
          ssr: isServer,
          rollupOptions: {
            input: isServer ? _chunkC3FDWALXjs.SERVER_ENTRY_PATH : _chunkC3FDWALXjs.CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      };
    };
    const clientBuild = async () => {
      return _vite.build.call(void 0, resolveViteConfig(false));
    };
    const serverBuild = async () => {
      return _vite.build.call(void 0, resolveViteConfig(true));
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
async function build(root, config) {
  const [clientBundle] = await bunlde(root, config);
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => _interopRequireWildcard(require(_url.pathToFileURL.call(void 0, serverEntryPath).toString())));
  try {
    await renderPage(render, root, clientBundle);
  } catch (error) {
    console.log("Render page error.\n", error);
  }
}
async function renderPage(render, root = process.cwd(), clientBundle) {
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
  await _fsextra2.default.ensureDir(_path.join.call(void 0, root, "build"));
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build", "index.html"), html);
  await _fsextra2.default.remove(_path.join.call(void 0, root, ".temp"));
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
