import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';

function RenderInBrowser() {
  const containerEl = document.getElementById('root');

  if (!containerEl) {
    throw new Error('#root element not found');
  }

  createRoot(containerEl).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

RenderInBrowser();
