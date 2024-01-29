import { useRoutes } from 'react-router-dom';

import { routes } from 'island:routes';

export function Content() {
  const routeElement = useRoutes(routes);

  return routeElement;
}
