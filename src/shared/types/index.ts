import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SiderBar {
  [path: string]: SiderBarGroup[];
}

export interface SiderBarGroup {
  text?: string;
  items: SiderBarItem[];
}

export type SiderBarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SiderBarItem[] };

export interface Footer {
  message?: string;
  copyright?: string;
}

export interface ThemeConfig {
  //导航栏
  nav?: NavItemWithLink[];
  //侧边栏
  sidebar?: SiderBar;
  foot?: Footer;
}

export interface UserConfig {
  title?: string;
  description?: string;
  themeConfig?: ThemeConfig;
  vite?: ViteConfiguration;
}

export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}
