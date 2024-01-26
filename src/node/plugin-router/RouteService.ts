import FastGlob from 'fast-glob';
import { relative } from 'path';
import { normalizePath } from 'vite';

export interface RouteRaw {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  #scanDir: string;
  #routeData: RouteRaw[] = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }

  //得到路由数组
  async init() {
    //先获取符合要求的全部文件路径
    const files = FastGlob.sync(['**/*.{js.ts,jsx,tsx,md,mdx}'], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/build/**', 'config.ts']
    }).sort();

    //规范文件路径
    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative(this.#scanDir, file));
      // console.log('fileRelativePath', fileRelativePath);

      //将文件路径替换
      const routePath = this.normalizeRoutePath(fileRelativePath);

      //将文件路径推入route数组
      this.#routeData.push({
        absolutePath: file,
        routePath
      });
    });
  }

  //处理文件后缀
  normalizeRoutePath(rawPath: string) {
    const routePath = rawPath.replace(/\.(.*)?$/, '').replace(/index$/, '');
    return routePath.startsWith('/') ? routePath : `/${routePath}`;
  }

  //生成虚拟模块的代码
  generateRouteCode(isSSR = false) {
    return `
    import React from 'react';
    ${isSSR ? '' : 'import loadable from "@loadable/component";'}
    ${this.#routeData
      .map((route, index) => {
        return isSSR
          ? `import Route${index} from "${route.absolutePath}";`
          : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
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
