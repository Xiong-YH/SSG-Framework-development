import { Plugin } from 'vite';
import { SiteConfig } from '../../shared/types';
import path, { join, relative } from 'path';
import { PACKAGE_ROOT, PUBLIC_DIR } from 'node/constants';
import sirv from 'sirv';
import fs from 'fs-extra';

const SITE_DATA_ID = 'island:site-data';

export function pluginConfig(
  config: SiteConfig,
  restart?: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    configureServer(server) {
      const publicDir = join(config.root, PUBLIC_DIR);
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly'
          }
        }
      };
    },
    //虚拟模块钩子
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },

    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },

    async handleHotUpdate(ctx) {
      //1.获得路径数组用于后续验证
      const customWatchedFile = [config.configPath];
      //验证函数
      const include = (filePath: string) =>
        customWatchedFile.some((file) => filePath.includes(file));
      if (!include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }

      //通过前面将创造服务器的函数传递过来，便于操纵服务器
      await restart();
    }
  };
}
