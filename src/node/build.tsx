import { InlineConfig, build as viteBuild } from 'vite';
import { join } from 'path';
import type { RollupOutput } from 'rollup';
import fs from 'fs-extra';
import pluginReact from '@vitejs/plugin-react';
import { pathToFileURL } from 'url';

import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants';

export async function bunlde(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: 'production',
        root,
        plugins: [pluginReact()],
        build: {
          outDir: isServer ? '.temp' : 'build',
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
      return viteBuild(resolveViteConfig(false));
    };

    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
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

export async function build(root: string) {
  //打包代码，包括 client 端 + server 端
  const [clientBundle, serverBundle] = await bunlde(root);
  //引入打包好的 server-entry 模块
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js'); //拿到路径
  //拿到其中的渲染函数
  const { render } = await import(pathToFileURL(serverEntryPath).toString());
  //服务端渲染，产出
  await renderPage(render, root, clientBundle);
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  console.log('Rendering page in server side...');

  const appHtml = render();
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
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  await fs.remove(join(root, '.temp'));
}
