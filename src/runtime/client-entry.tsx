import { createRoot, hydrateRoot } from 'react-dom/client';
import { App, initPageData } from './App';
import { BrowserRouter } from 'react-router-dom';
import { DataContext } from './hook';
import { ComponentType } from 'react';

declare global {
  interface Window {
    ISLANDS: Record<string, ComponentType<unknown>>;
    ISLAND_PROPS: unknown[];
  }
}

async function RenderInBrowser() {
  const containerEl = document.getElementById('root');

  //获取页面数据

  if (import.meta.env.DEV) {
    //如果为开发环境就全量hydration

    const pageData = await initPageData(location.pathname);

    if (!containerEl) {
      throw new Error('#root element not found');
    }
    createRoot(containerEl).render(
      <DataContext.Provider value={pageData}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </DataContext.Provider>
    );
  } else {
    // 生产环境下的 Partial Hydration
    const islands = document.querySelectorAll('[__island]');

    if (islands.length === 0) {
      return;
    }

    for (const island of islands) {
      // 格式Aside:0
      const [id, index] = island.getAttribute('__island').split(':');

      console.log('[id,index]', [id, index]);

      const Element = window.ISLANDS[id] as ComponentType<unknown>;

      hydrateRoot(island, <Element {...window.ISLAND_PROPS[index]} />);
    }
  }
}

RenderInBrowser();
