import { UserConfig as UserConfig$1 } from 'vite';

type NavItemWithLink = {
    text: string;
    link: string;
};
interface SiderBar {
    [path: string]: SiderBarGroup[];
}
interface SiderBarGroup {
    text?: string;
    items: SiderBarItem[];
}
type SiderBarItem = {
    text: string;
    link: string;
} | {
    text: string;
    link?: string;
    items: SiderBarItem[];
};
interface Footer {
    message?: string;
    copyright?: string;
}
interface ThemeConfig {
    nav?: NavItemWithLink[];
    sidebar?: SiderBar;
    foot?: Footer;
}
interface UserConfig {
    title?: string;
    description?: string;
    themeConfig?: ThemeConfig;
    vite?: UserConfig$1;
}

declare const _default: UserConfig;

export { _default as default };
