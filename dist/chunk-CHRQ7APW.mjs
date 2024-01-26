import {
  __dirname
} from "./chunk-DGIDFQB4.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-island/PluginConfig.ts
import { relative } from "path";
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
${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }
      await restart();
    }
  };
}

export {
  PACKAGE_ROOT,
  DEFAULT_TEMPLATE_PATH,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  pluginConfig
};
