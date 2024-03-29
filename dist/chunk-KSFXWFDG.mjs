// node_modules/.pnpm/tsup@6.7.0_postcss@8.4.33_ts-node@10.9.2_typescript@4.9.5/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/config.ts
import { resolve } from "path";
import fs from "fs";
import { loadConfigFromFile } from "vite";
function resolveSiteData(config) {
  return {
    title: config.title || "island.js",
    description: config.description || "SSG",
    themeConfig: config.themeConfig || {},
    vite: config.vite || {}
  };
}
function getUserConfigPath(root) {
  try {
    const supportConfigFile = ["config.js", "config.ts"];
    const configPath = supportConfigFile.map((file) => {
      return resolve(root, file);
    }).find(fs.existsSync);
    return configPath;
  } catch (error) {
    console.log("\u6587\u4EF6\u89E3\u6790\u51FA\u9519", error);
  }
}
async function resolveConfig(root, command, mode) {
  const resolveUserConfig = async () => {
    const configPath2 = getUserConfigPath(root);
    const result = await loadConfigFromFile(
      {
        command,
        mode
      },
      configPath2,
      root
    );
    if (result) {
      const { config: rawconfig = {} } = result;
      const userconfig2 = await (typeof rawconfig === "function" ? rawconfig() : rawconfig);
      return [configPath2, userconfig2];
    } else {
      return [configPath2, {}];
    }
  };
  const [configPath, userconfig] = await resolveUserConfig();
  const siteConfig = {
    root,
    configPath,
    siteData: resolveSiteData(userconfig)
  };
  return siteConfig;
}
function defineConfig(config) {
  return config;
}

export {
  __dirname,
  resolveConfig,
  defineConfig
};
