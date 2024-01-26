import { createServer } from 'vite';
import { resolveConfig } from './config';
import { PACKAGE_ROOT } from './constants';
import { createVitePlugins } from './vitePlugins';

export async function createDevServer(
  root: string,
  restart: () => Promise<void>
) {
  const config = await resolveConfig(root, 'serve', 'development');

  return createServer({
    root: PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restart)
  });
}
