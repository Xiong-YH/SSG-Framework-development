import { createServer } from 'vite';
import { PluginIndexHtml } from './plugin-island/indexHtml';
import pluginReact from '@vitejs/plugin-react';
import { resolveConfig } from './config';
import { pluginConfig } from './plugin-island/PluginConfig';

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');

  return createServer({
    root,
    plugins: [PluginIndexHtml(), pluginReact(), pluginConfig(config, restart)]
  });
}
