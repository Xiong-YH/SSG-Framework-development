import FastGlob from 'fast-glob';
import { relative } from 'path';
import { normalizePath } from 'vite';

interface RouteRaw {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteRaw[] = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }

  async init() {
    const files = FastGlob.sync(['**/*.{js.ts,jsx,tsx,md,mdx}'], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
    }).sort();

    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative(this.#scanDir, file));
      // console.log('fileRelativePath', fileRelativePath);

      const routePath = this.normalizeRoutePath(fileRelativePath);

      this.#routeData.push({
        absolutePath: file,
        routePath
      });
    });
  }

  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  generateRouteCode() {
    return `
    import React from 'react';
    import loadable from '@loadable/component';
    ${this.#routeData
      .map((route, index) => {
        return `const Route${index} = loadable(()=>import('${route.absolutePath}'))`;
      })
      .join('\n')}
    export const routes = [
        ${this.#routeData
          .map((route, index) => {
            return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
          })
          .join(',\n')}
        ];
    `;
  }
}
