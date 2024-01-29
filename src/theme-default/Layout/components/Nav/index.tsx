import { usePageData } from '@runtime';
import { NavItemWithLink } from 'shared/types';
import style from './index.module.scss';
import { SwitchApperance } from '../SwitchAppearance';

export function MenuItem({ item }: { item: NavItemWithLink }) {
  return (
    <div className="text-sm font-medium mx-3">
      <a href={item.link} className={style.link}>
        {item.text}
      </a>
    </div>
  );
}

export function Nav() {
  const { siteData } = usePageData();

  const nav = siteData.themeConfig.nav || [];

  return (
    <header fixed="~" pos="t-0 left-0" w="full" z="10">
      <div
        flex="~"
        items="center"
        justify="between"
        // className="p-8 h-4 divider-bottom"
        className={`h-14 divider-bottom ${style.nav}`}
      >
        <div>
          <a
            href="/"
            hover="opacity-60"
            className="w-full h-full text-1rem flex items-center font-semibold"
          >
            island.js
          </a>
        </div>
        <div flex="~">
          {/* 普通菜单 */}
          <div flex="~">
            {nav.map((navItem) => {
              return <MenuItem item={navItem} key={navItem.link} />;
            })}
          </div>

          {/* 黑夜模式 */}
          <div before="menu-item-before" flex="~">
            <SwitchApperance />
          </div>

          {/* 图标 */}
          <div
            className={style.socialLinkIcon}
            ml="2"
            before="menu-item-before"
          >
            <a href="">
              <div className="i-carbon-logo-github w-5 h-5 fill-current"></div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
