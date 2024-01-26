import { InlineConfig, build as viteBuild } from 'vite';
import { dirname, join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';

import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugin-router';

export async function bunlde(root: string, config: SiteConfig) {
  try {
    //书写打包时配置
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, isServer),
        ssr: {
          noExternal: ['react-router-dom']
        },
        build: {
          minify: false,
          outDir: isServer ? join(root, '.temp') : join(root, 'build'),
          ssr: isServer,
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? 'cjs' : 'esm'
            }
          }
        }
      };
    };

    const clientBuild = async () => {
      return await viteBuild(await resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return await viteBuild(await resolveViteConfig(true));
    };

    const [clientBundle, serverBundle] = await Promise.all([
      clientBuild(),
      serverBuild()
    ]);
    //使用promis.all并行处理
    // await clientBuild();
    // await serverBuild();

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

//renderPage函数
export async function renderPage(
  render: (url: string) => string,
  root: string = process.cwd(),
  clientBundle: RollupOutput,
  routes: Route[]
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side...');

  return Promise.all(
    routes.map(async (route) => {
      const appHtml = render(route.path);

      //渲染页面
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <div id="root">${appHtml}</div>
          <script type="module" src="${clientChunk.fileName}"></script>
      </body>
      </html>
      `.trim();

      const fileName = route.path.endsWith('/')
        ? `${route.path}index.html`
        : `${route.path}.html`;
      await fs.ensureDir(join(root, 'build', dirname(fileName))); //确定文件存在
      await fs.writeFile(join(root, 'build', fileName), html);
      // await fs.remove(join(root, '.temp'));
    })
  );
}

//build函数
export async function build(root: string, config: SiteConfig) {
  //打包代码，包括 client 端 + server 端
  const [clientBundle] = await bunlde(root, config);
  //引入打包好的 server-entry 模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js'); //拿到路径
  //拿到其中的渲染函数
  const { render, routes } = await import(
    pathToFileURL(serverEntryPath).toString()
  );
  //服务端渲染，产出
  try {
    await renderPage(render, root, clientBundle, routes);
  } catch (error) {
    console.log('Render page error.\n', error);
  }
}
