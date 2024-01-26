import { Plugin } from 'vite';
import { RouteService } from './RouteService';

interface PluginOption {
  root: string;
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
        return routeService.generateRouteCode();
      }
    }
  };
}
