import { usePageData } from '@runtime';
import { useLocation } from 'react-router-dom';
import { SideBarItem } from 'shared/types';

export function usePrevNextPage() {
  const { siteData } = usePageData();
  const { pathname } = useLocation();

  const flatTitles: SideBarItem[] = [];
  const sitebar = siteData.themeConfig?.sidebar || {};

  //收集文章信息，平铺推入数组
  Object.keys(sitebar).forEach((key) => {
    const groups = sitebar[key] || [];
    groups.forEach((group) => {
      group.items.forEach((item) => {
        flatTitles.push(item);
      });
    });
  });

  //
  const pageIndex = flatTitles.findIndex((item) => item.link === pathname);

  const prevPage = flatTitles[pageIndex - 1] || null;
  const nextPage = flatTitles[pageIndex + 1] || null;

  return {
    prevPage,
    nextPage
  };
}
