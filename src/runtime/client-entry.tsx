import { createRoot } from 'react-dom/client';
import { App } from './App';
import sideData from 'island:site-data';

function RenderInBrowser() {
  const containerEl = document.getElementById('root');

  if (!containerEl) {
    throw new Error('#root element not found');
  }

  createRoot(containerEl).render(<App />);
  console.log(sideData);
}

RenderInBrowser();
