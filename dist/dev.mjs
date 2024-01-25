import {
  CLIENT_ENTRY_PATH,
  DEFAULT_TEMPLATE_PATH
} from "./chunk-2IFRJ42P.mjs";
import {
  resolveConfig
} from "./chunk-VO2J5KVO.mjs";
import "./chunk-JIN4FLKK.mjs";

// src/node/dev.ts
import { createServer } from "vite";

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";
function PluginIndexHtml() {
  return {
    name: "island:index-html",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
          try {
            content = await server.transformIndexHtml(
              req.url,
              content,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(content);
          } catch (e) {
            console.log(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import pluginReact from "@vitejs/plugin-react";

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
      if (include(ctx.file)) {
        console.log(
          `
${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }
      await restart();
    }
  };
}

// src/node/dev.ts
async function createDevServer(root, restart) {
  const config = await resolveConfig(root, "serve", "development");
  return createServer({
    root,
    plugins: [PluginIndexHtml(), pluginReact(), pluginConfig(config, restart)]
  });
}
export {
  createDevServer
};
