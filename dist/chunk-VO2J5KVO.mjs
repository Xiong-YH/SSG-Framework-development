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
  resolveConfig,
  defineConfig
};
