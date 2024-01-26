"use strict";Object.defineProperty(exports, "__esModule", {value: true});// src/node/constants/index.ts
var _path = require('path');
var PACKAGE_ROOT = _path.join.call(void 0, __dirname, "..");
var DEFAULT_TEMPLATE_PATH = _path.join.call(void 0, PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = _path.join.call(void 0, 
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-island/PluginConfig.ts

var SITE_DATA_ID = "island:site-data";
function pluginConfig(config, restart) {
  return {
    name: "island:site-data",
    //虚拟模块钩子
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFile = [config.configPath];
      const include = (filePath) => customWatchedFile.some((file) => filePath.includes(file));
      if (!include(ctx.file)) {
        console.log(
          `
${_path.relative.call(void 0, config.root, ctx.file)} changed, restarting server...`
        );
      }
      await restart();
    }
  };
}







exports.PACKAGE_ROOT = PACKAGE_ROOT; exports.DEFAULT_TEMPLATE_PATH = DEFAULT_TEMPLATE_PATH; exports.CLIENT_ENTRY_PATH = CLIENT_ENTRY_PATH; exports.SERVER_ENTRY_PATH = SERVER_ENTRY_PATH; exports.pluginConfig = pluginConfig;
