import { UserConfig as UserConfig$1 } from 'vite';

type NavItemWithLink = {
    text: string;
    link: string;
};
interface SideBar {
    [path: string]: SideBarGroup[];
}
interface SideBarGroup {
    text?: string;
    items: SideBarItem[];
}
type SideBarItem = {
    text: string;
    link: string;
} | {
    text: string;
    link?: string;
    items: SideBarItem[];
};
interface Footer {
    message?: string;
    copyright?: string;
}
interface ThemeConfig {
    nav?: NavItemWithLink[];
    sidebar?: SideBar;
    foot?: Footer;
}
interface UserConfig {
    title?: string;
    description?: string;
    themeConfig?: ThemeConfig;
    vite?: UserConfig$1;
}

declare function defineConfig(config: UserConfig): UserConfig;

export { defineConfig };
