/// <reference types="vite/client"/>

declare module 'island:site-data' {
  import type { UserConfig } from 'shared/types';
  const siteData: UserConfig;
  export default siteData;
}

declare module 'island:routes' {
  import type { Route } from 'node/plugin-router';

  export const routes: Route[];
}
