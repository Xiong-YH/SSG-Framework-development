"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/node/config.ts
var _path = require('path');
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _vite = require('vite');
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
      return _path.resolve.call(void 0, root, file);
    }).find(_fs2.default.existsSync);
    return configPath;
  } catch (error) {
    console.log("\u6587\u4EF6\u89E3\u6790\u51FA\u9519", error);
  }
}
async function resolveConfig(root, command, mode) {
  const resolveUserConfig = async () => {
    const configPath2 = getUserConfigPath(root);
    const result = await _vite.loadConfigFromFile.call(void 0, 
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




exports.resolveConfig = resolveConfig; exports.defineConfig = defineConfig;
