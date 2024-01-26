import {
  PACKAGE_ROOT,
  createVitePlugins
} from "./chunk-X63OVSG2.mjs";
import {
  resolveConfig
} from "./chunk-DGIDFQB4.mjs";

// src/node/dev.ts
import { createServer } from "vite";
async function createDevServer(root, restart) {
  const config = await resolveConfig(root, "serve", "development");
  return createServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restart)
  });
}
export {
  createDevServer
};
