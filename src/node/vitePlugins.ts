import { pluginConfig } from './plugin-island/PluginConfig';
import { PluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PluginRoutes } from './plugin-router';
import { SiteConfig } from 'shared/types';
import { createPluginMdx } from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import { unocssOption } from 'node/unocssOption';
import babelPluginIsland from './babel-plugin-island';
import { join } from 'path';
import { PACKAGE_ROOT } from './constants';

export async function createVitePlugins(
  config: SiteConfig,
  restart?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOption),
    PluginIndexHtml(),
    pluginReact({
      jsxRuntime: 'automatic',
      jsxImportSource: isSSR ? join(PACKAGE_ROOT, 'src', 'runtime') : 'react',
      babel: {
        plugins: [babelPluginIsland]
      }
    }),
    pluginConfig(config, restart),
    PluginRoutes({ root: config.root, isSSR }),
    await createPluginMdx()
  ];
}
