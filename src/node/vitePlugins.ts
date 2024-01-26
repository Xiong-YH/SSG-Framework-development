import { pluginConfig } from './plugin-island/PluginConfig';
import { PluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PluginRoutes } from './plugin-router';
import { SiteConfig } from 'shared/types';
import { createPluginMdx } from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import { unocssOption } from 'node/unocssOption';

export async function createVitePlugins(
  config: SiteConfig,
  isSSR = false,
  restart?: () => Promise<void>
) {
  return [
    pluginUnocss(unocssOption),
    PluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restart),
    PluginRoutes({ root: config.root, isSSR }),
    await createPluginMdx()
  ];
}
