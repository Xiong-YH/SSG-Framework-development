"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunk5OLNIFISjs = require('./chunk-5OLNIFIS.js');


var _chunkICQFTZDUjs = require('./chunk-ICQFTZDU.js');

// src/node/dev.ts
var _vite = require('vite');
async function createDevServer(root, restart) {
  const config = await _chunkICQFTZDUjs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root: _chunk5OLNIFISjs.PACKAGE_ROOT,
    plugins: await _chunk5OLNIFISjs.createVitePlugins.call(void 0, config, restart)
  });
}


exports.createDevServer = createDevServer;
