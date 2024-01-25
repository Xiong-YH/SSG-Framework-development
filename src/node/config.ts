import { resolve } from 'path';
import fs from 'fs';
import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from 'shared/types';

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

//设定配置模板
export function resolveSiteData(config: UserConfig): UserConfig {
  return {
    title: config.title || 'island.js',
    description: config.description || 'SSG',
    themeConfig: config.themeConfig || {},
    vite: config.vite || {}
  };
}

//文件配置路径函数
export function getUserConfigPath(root: string) {
  try {
    const supportConfigFile = ['config.js', 'config.ts'];

    const configPath = supportConfigFile
      .map((file) => {
        return resolve(root, file); //解析为绝对路径
      })
      .find(fs.existsSync);

    return configPath;
  } catch (error) {
    console.log('文件解析出错', error);
  }
}

//解析配置文件
export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<SiteConfig> {
  const resolveUserConfig = async () => {
    //1.得到配置文件路径
    const configPath = getUserConfigPath(root);

    //配置文件解析器
    const result = await loadConfigFromFile(
      {
        command,
        mode
      },
      configPath,
      root
    );

    if (result) {
      const { config: rawconfig = {} as RawConfig } = result;

      const userconfig = await (typeof rawconfig === 'function'
        ? rawconfig()
        : rawconfig);

      return [configPath, userconfig] as const; //声明文件不可变
    } else {
      return [configPath, {} as RawConfig] as const;
    }
  };

  const [configPath, userconfig] = await resolveUserConfig();

  const siteConfig = {
    root,
    configPath: configPath,
    siteData: resolveSiteData(userconfig as UserConfig)
  };

  return siteConfig;
}

//定义类型提示
export function defineConfig(config: UserConfig): UserConfig {
  return config;
}
