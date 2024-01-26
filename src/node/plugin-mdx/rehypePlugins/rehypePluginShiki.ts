import type { Plugin } from 'unified';
import type { Root, Text } from 'hast';
import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import shiki from 'shiki';

interface Options {
  highlight: shiki.Highlighter;
}

export const rehypePluginShiki: Plugin<[Options], Root> = ({ highlight }) => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      //<pre><code>...</code></pre>
      if (
        node.tagName === 'pre' &&
        node.children[0].type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const content = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';

        const lang = codeClassName.split('-')[1];
        if (!lang) {
          return;
        }
        //代码高亮处理
        const highlightCode = highlight.codeToHtml(content, { lang });
        //转化为AST
        const fragmentAST = fromHtml(highlightCode, { fragment: true });
        // console.log('fragmentAST是', fragmentAST);
        parent.children.splice(index, 1, ...fragmentAST.children);
      }
    });
  };
};
