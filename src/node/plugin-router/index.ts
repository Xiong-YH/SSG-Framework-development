import { Plugin } from 'vite';
import { RouteService } from './RouteService';
import { PageMoudule } from 'shared';

interface PluginOption {
  root: string;
  isSSR: boolean;
}

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageMoudule>;
}

export const CONVENTIONAL_ROUTE_ID = 'island:routes';

export function PluginRoutes(options: PluginOption): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: 'island:routes',

    async configResolved() {
      await routeService.init();
    },

    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return '\0' + CONVENTIONAL_ROUTE_ID;
      }
    },

    load(id) {
      if (id === '\0' + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRouteCode(options.isSSR || false);
      }
    }
  };
}
