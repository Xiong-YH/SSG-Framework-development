import * as jsxRuntime from 'react/jsx-runtime';

const originJSX = jsxRuntime.jsx;
const originJSXS = jsxRuntime.jsxs;

export const data = {
  islandProp: [],
  islandPathToMap: {}
};

export const clearIslandData = () => {
  data.islandProp = [];
  data.islandPathToMap = {};
};

const internalJsx = (jsx, type, props, ...args) => {
  //如果发现组件拥有island属性
  if (props && props.__island) {
    data.islandProp.push(props);
    const id = type.name;
    data['islandPathToMap'][id] = props.__island;

    delete props.__island;

    return jsx('div', {
      __island: `${id}:${data.islandProp.length - 1}`,
      children: jsx(type, props, ...args)
    });
  }

  //直接走原始路径
  return jsx(type, props, ...args);
};

export const jsx = (...args) => internalJsx(originJSX, ...args);

export const jsxs = (...args) => internalJsx(originJSXS, ...args);
export const Fragment = jsxRuntime.Fragment;
