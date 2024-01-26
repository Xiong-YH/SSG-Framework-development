import pluginMdx from '@mdx-js/rollup';
import remarkPluginGRF from 'remark-gfm'; //语法规范
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkFrontMatter from 'remark-frontmatter';
import remarkMdxFrontMatter from 'remark-mdx-frontmatter';
import { Plugin } from 'vite';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { rehypePluginShiki } from './rehypePlugins/rehypePluginShiki';
import shiki from 'shiki';
import { remarkPluginToc } from './remarkPlugin/toc';

export async function pluginMdxRollup(): Promise<Plugin> {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGRF,
      remarkFrontMatter,
      [remarkMdxFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc
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
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          highlight: await shiki.getHighlighter({ theme: 'nord' })
        }
      ]
    ]
  }) as unknown as Plugin;
}
