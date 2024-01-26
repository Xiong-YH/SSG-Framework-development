import { pluginConfig } from './plugin-island/PluginConfig';
import { PluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { PluginRoutes } from './plugin-router';
import { SiteConfig } from 'shared/types';
import { createPluginMdx } from './plugin-mdx';

export async function createVitePlugins(
  config: SiteConfig,
  restart: () => Promise<void>
) {
  return [
    PluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restart),
    PluginRoutes({ root: config.root }),
    await createPluginMdx()
  ];
}
