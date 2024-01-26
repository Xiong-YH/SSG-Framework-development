import assert from 'assert';
import { Plugin } from 'vite';

export function pluginMdxHmr(): Plugin {
  let vitePluginReact: Plugin;
  return {
    name: 'vite-plugin-mdx-hmr',
    apply: 'serve', //用于开发环境
    configResolved(config) {
      vitePluginReact = config.plugins.find(
        (plugin) => plugin.name === 'vite:react-babel'
      );
    },

    async transform(code, id, opts) {
      if (/\.mdx?/.test(id)) {
        assert(typeof vitePluginReact.transform === 'function'); //类型断言
        const result = await vitePluginReact.transform?.call(
          this,
          code,
          id + '?.jsx',
          opts
        );

        const selfAcceptCode = 'import.meta.hot.accept();';
        if (
          typeof result === 'object' &&
          !result!.code?.includes(selfAcceptCode)
        ) {
          result!.code += selfAcceptCode;
        }
        return result;
      }
    }
  };
}
