import { createContext, useContext } from 'react';
import { PageData } from 'shared';

export const DataContext = createContext({} as PageData);

export const usePageData = () => {
  return useContext(DataContext);
};
