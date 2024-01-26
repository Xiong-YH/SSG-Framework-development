"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunkPKGZNC3Ajs = require('./chunk-PKGZNC3A.js');


var _chunkICQFTZDUjs = require('./chunk-ICQFTZDU.js');

// src/node/dev.ts
var _vite = require('vite');
async function createDevServer(root, restart) {
  const config = await _chunkICQFTZDUjs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root: _chunkPKGZNC3Ajs.PACKAGE_ROOT,
    plugins: await _chunkPKGZNC3Ajs.createVitePlugins.call(void 0, config, restart)
  });
}


exports.createDevServer = createDevServer;
