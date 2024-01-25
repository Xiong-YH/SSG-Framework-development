import { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { CLIENT_ENTRY_PATH, DEFAULT_TEMPLATE_PATH } from '../constants';

export function PluginIndexHtml(): Plugin {
  return {
    name: 'island:index-html',
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: {
              type: 'module',
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: 'body'
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          //1.得到template模板路径（配置路径常量
          let content = await readFile(DEFAULT_TEMPLATE_PATH, 'utf-8');

          try {
            //添加模块热更新
            content = await server.transformIndexHtml(
              req.url,
              content,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(content);
          } catch (e) {
            console.log(e);
          }
        });
      };
    }
  };
}
