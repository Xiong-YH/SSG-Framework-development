import { InlineConfig, build as viteBuild } from 'vite';
import path, { dirname, join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import { pathToFileURL } from 'url';

import {
  CLIENT_ENTRY_PATH,
  CLIENT_OUTPUT,
  MASK_SPLITTER,
  SERVER_ENTRY_PATH
} from './constants';
import { SiteConfig } from 'shared/types';
import { createVitePlugins } from './vitePlugins';
import { Route } from './plugin-router';
import { RenderResult } from 'runtime/ssr-entry';

export async function bunlde(root: string, config: SiteConfig) {
  try {
    //书写打包时配置
    const resolveViteConfig = async (
      isServer: boolean
    ): Promise<InlineConfig> => {
      return {
        mode: 'production',
        root,
        plugins: await createVitePlugins(config, null, isServer),
        ssr: {
          noExternal: ['react-router-dom', 'lodash-es']
        },
        build: {
          minify: false,
          outDir: isServer ? join(root, '.temp') : join(root, CLIENT_OUTPUT),
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
    const publicDir = join(root, 'public');
    if (fs.pathExistsSync(publicDir)) {
      await fs.copy(publicDir, join(root, CLIENT_OUTPUT));
    }

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (error) {
    console.log(error);
  }
}

//renderPage函数
export async function renderPage(
  render: (url: string) => Promise<RenderResult>,
  root: string = process.cwd(),
  clientBundle: RollupOutput,
  routes: Route[]
) {
  //客户端JS代码
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  debugger;
  console.log('Rendering page in server side...');

  return Promise.all(
    routes.map(async (route) => {
      const result = await render(route.path);

      const { appHtml, islandPathToMap, propsData = [] } = result;
      //island打包代码
      const islandBundle = await buildIsland(root, islandPathToMap);
      //island组件代码
      const islandCode = (islandBundle as RollupOutput).output[0].code;
      //样式代码
      const styleAssets = clientBundle.output.filter(
        (chunk) => chunk.type === 'asset' && chunk.fileName.endsWith('.css')
      );
      //渲染页面
      const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          ${styleAssets
            .map((item) => `<link rel="stylesheet" href="/${item.fileName}">`)
            .join('\n')}
      </head>
      <body>
          <div id="root">${appHtml}</div>
          <script type="module">${islandCode}</script>
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

//buildIsland函数
export async function buildIsland(
  root: string,
  islandPathToMap: Record<string, string>
) {
  //拼接模块代码内容
  const islandInjectCode = `
    ${Object.entries(islandPathToMap)
      .map(
        ([islandId, islandPath]) => `import {${islandId}} from '${islandPath}'`
      )
      .join('')}
    window.ISLAND=${Object.keys(islandPathToMap).join(',')}
    window.ISLAND_PROPS = JSON.parse(
      document.getElementById('island-props').textContent
    )
  `;

  const inject = 'island:inject';

  return viteBuild({
    mode: 'production',
    build: {
      outDir: join(root, '.temp'),
      rollupOptions: {
        input: inject
      }
    },

    plugins: [
      {
        name: 'island:inject',
        enforce: 'post', //构建之后使用的插件
        resolveId(id) {
          if (id.includes(MASK_SPLITTER)) {
            const [originId, importor] = id.split(MASK_SPLITTER);

            return this.resolve(originId, importor, { skipSelf: true });
          }

          if (id === inject) {
            return id;
          }
        },

        //
        load(id) {
          if (id === inject) {
            return islandInjectCode;
          }
        },

        //打包产物不加入静态资源文件,只需要JS
        generateBundle(_, bundle) {
          for (const name in bundle) {
            if (bundle[name].type === 'asset') {
              delete bundle[name];
            }
          }
        }
      }
    ]
  });
}
