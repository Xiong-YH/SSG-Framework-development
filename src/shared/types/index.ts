import { ComponentType } from 'react';
import { UserConfig as ViteConfiguration } from 'vite';

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface SideBar {
  [path: string]: SideBarGroup[];
}

export interface SideBarGroup {
  text?: string;
  items: SideBarItem[];
}

export type SideBarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SideBarItem[] };

export interface Footer {
  message?: string;
  copyright?: string;
}

export interface ThemeConfig {
  //导航栏
  nav?: NavItemWithLink[];
  //侧边栏
  sidebar?: SideBar;
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

export type PageType = 'home' | 'doc' | 'custom' | '404';

export interface FrontMatter {
  title?: string;
  description?: string;
  pageType?: PageType;
  sidebar?: boolean;
  outline?: boolean;

  features?: Feature[];
  hero?: Hero;
}

export interface PageData {
  siteData: UserConfig; //站点相关数据
  pagePath: string; //路由信息
  frontmatter: FrontMatter; //页面元信息
  pageType: PageType;
  toc?: Header[];
}

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface PageMoudule {
  default: ComponentType;
  frontmatter: FrontMatter;
  toc?: Header[];
  [key: string]: unknown;
}

export interface Feature {
  icon: string;
  title: string;
  details: string;
}

export interface Hero {
  name: string;
  text: string;
  tagline: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: {
    text: string;
    link: string;
    theme: 'brand' | 'alt';
  }[];
}

export type PropsWithIsland = {
  __island?: boolean;
};
