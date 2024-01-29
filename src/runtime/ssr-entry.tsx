import { App, initPageData } from './App';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { DataContext } from './hook';

export interface RenderResult {
  appHtml: string;
  propsData: unknown[];
  islandPathToMap: Record<string, string>;
}

export async function render(pagePath: string) {
  const pageData = await initPageData(pagePath);

  const { clearIslandData, data } = await import('./jsx-runtime');
  const { islandProp, islandPathToMap } = data;
  clearIslandData();

  const appHtml = renderToString(
    <DataContext.Provider value={pageData}>
      <StaticRouter location={pagePath}>
        <App />
      </StaticRouter>
    </DataContext.Provider>
  );

  return {
    appHtml,
    islandProp,
    islandPathToMap
  };
}

export { routes } from 'island:routes';
