import pluginMdx from '@mdx-js/rollup';
import remarkPluginGRF from 'remark-gfm'; //语法规范
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkFrontMatter from 'remark-frontmatter';
import remarkMdxFrontMatter from 'remark-mdx-frontmatter';
import { Plugin } from 'vite';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';

export function pluginMdxRollup(): Plugin {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGRF,
      remarkFrontMatter,
      [remarkMdxFrontMatter, { name: 'frontmatter' }]
    ],
    rehypePlugins: [
      //增加锚点
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            class: 'head-anch'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ],
      rehypePluginPreWrapper
    ]
  }) as unknown as Plugin;
}
