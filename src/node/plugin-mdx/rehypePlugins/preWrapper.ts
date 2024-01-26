import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';
import type { Plugin } from 'unified';

export const rehypePluginPreWrapper: Plugin<[], Root> = () => {
  return (tree) => {
    //visit函数将每个节点都遍历
    visit(tree, 'element', (node) => {
      if (
        node.tagName === 'pre' &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code' &&
        !node.data?.isVisited
      ) {
        const codeChild = node.children[0];
        const nodeClassName = codeChild.properties?.className?.toString() || '';
        const lang = nodeClassName.split('-')[1];

        const cloneNode: Element = {
          type: 'element',
          tagName: 'pre',
          children: node.children,
          data: {
            isVisited: true
          },
          properties: node.properties
        };

        node.tagName = 'div';
        node.properties = node.properties || {};
        node.properties.className = nodeClassName;

        node.children = [
          {
            type: 'element',
            tagName: 'span',
            properties: {
              className: 'lang'
            },
            children: [
              {
                type: 'text',
                value: lang
              }
            ]
          },
          cloneNode
        ];
      }
    });
  };
};
