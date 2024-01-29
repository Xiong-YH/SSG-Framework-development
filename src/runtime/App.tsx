import { matchRoutes } from 'react-router-dom';
import { Layout } from '../theme-default/Layout';
import { routes } from 'island:routes';
import siteData from 'island:site-data';
import { PageData } from 'shared/types';

export async function initPageData(routePath: string): Promise<PageData> {
  const matched = matchRoutes(routes, routePath);
  if (matched) {
    const route = matched[0].route;

    const moduleInfo = await route.preload();

    // debugger;
    return {
      siteData: siteData,
      pageType: moduleInfo?.frontmatter?.pageType ?? 'doc',
      frontmatter: moduleInfo.frontmatter,
      pagePath: routePath,
      toc: moduleInfo.toc
    } as PageData;
  }

  return {
    pageType: '404',
    siteData,
    pagePath: routePath,
    frontmatter: {}
  };
}

export function App() {
  return <Layout />;
}
