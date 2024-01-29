import {
  __dirname
} from "./chunk-KSFXWFDG.mjs";

// src/node/constants/index.ts
import { join } from "path";
var PACKAGE_ROOT = join(__dirname, "..");
var DEFAULT_TEMPLATE_PATH = join(PACKAGE_ROOT, "template.html");
var CLIENT_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);
var PUBLIC_DIR = "public";
var MASK_SPLITTER = "!!ISLAND!!";
var CLIENT_OUTPUT = "build";

// src/node/plugin-island/PluginConfig.ts
import { join as join2, relative } from "path";
import sirv from "sirv";
import fs from "fs-extra";
var SITE_DATA_ID = "island:site-data";
function pluginConfig(config, restart) {
  return {
    name: "island:config",
    configureServer(server) {
      const publicDir = join2(config.root, PUBLIC_DIR);
      if (fs.pathExistsSync(publicDir)) {
        server.middlewares.use(sirv(publicDir));
      }
    },
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            "@runtime": join2(PACKAGE_ROOT, "src", "runtime", "index.ts")
          }
        },
        css: {
          modules: {
            localsConvention: "camelCaseOnly"
          }
        }
      };
    },
    //虚拟模块钩子
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return "\0" + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === "\0" + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    async handleHotUpdate(ctx) {
      const customWatchedFile = [config.configPath];
      const include = (filePath) => customWatchedFile.some((file) => filePath.includes(file));
      if (!include(ctx.file)) {
        console.log(
          `
${relative(config.root, ctx.file)} changed, restarting server...`
        );
      }
      await restart();
    }
  };
}

// src/node/plugin-island/indexHtml.ts
import { readFile } from "fs/promises";
function PluginIndexHtml() {
  return {
    name: "island:index-html",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await readFile(DEFAULT_TEMPLATE_PATH, "utf-8");
          try {
            content = await server.transformIndexHtml(
              req.url,
              content,
              req.originalUrl
            );
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            res.end(content);
          } catch (e) {
            console.log(e);
          }
        });
      };
    }
  };
}

// src/node/vitePlugins.ts
import pluginReact from "@vitejs/plugin-react";

// src/node/plugin-router/RouteService.ts
import FastGlob from "fast-glob";
import { relative as relative2 } from "path";
import { normalizePath } from "vite";
var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  //得到路由数组
  async init() {
    const files = FastGlob.sync(["**/*.{js.ts,jsx,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = normalizePath(relative2(this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        absolutePath: file,
        routePath
      });
    });
  }
  //处理文件后缀
  normalizeRoutePath(rawPath) {
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  //生成虚拟模块的代码
  generateRouteCode(isSSR = false) {
    return `
    import React from 'react';
    ${isSSR ? "" : 'import loadable from "@loadable/component";'}
    ${this.#routeData.map((route, index) => {
      return isSSR ? `import Route${index} from "${route.absolutePath}";` : `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
    }).join("\n")}
    export const routes = [
        ${this.#routeData.map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}), preload:()=>import('${route.absolutePath}') }`;
    }).join(",\n")}
        ];
    `;
  }
};

// src/node/plugin-router/index.ts
var CONVENTIONAL_ROUTE_ID = "island:routes";
function PluginRoutes(options) {
  const routeService = new RouteService(options.root);
  return {
    name: "island:routes",
    async configResolved() {
      await routeService.init();
    },
    resolveId(id) {
      if (id === CONVENTIONAL_ROUTE_ID) {
        return "\0" + CONVENTIONAL_ROUTE_ID;
      }
    },
    load(id) {
      if (id === "\0" + CONVENTIONAL_ROUTE_ID) {
        return routeService.generateRouteCode(options.isSSR || false);
      }
    }
  };
}

// src/node/plugin-mdx/pluginMdxRollup.ts
import pluginMdx from "@mdx-js/rollup";
import remarkPluginGRF from "remark-gfm";

// node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js
import Slugger from "github-slugger";

// node_modules/.pnpm/hast-util-has-property@2.0.1/node_modules/hast-util-has-property/lib/index.js
var own = {}.hasOwnProperty;
function hasProperty(node, field) {
  const value = typeof field === "string" && isNode(node) && node.type === "element" && node.properties && own.call(node.properties, field) && node.properties[field];
  return value !== null && value !== void 0 && value !== false;
}
function isNode(value) {
  return Boolean(value && typeof value === "object" && "type" in value);
}

// node_modules/.pnpm/hast-util-heading-rank@2.1.1/node_modules/hast-util-heading-rank/lib/index.js
function headingRank(node) {
  const name = node && node.type === "element" && node.tagName.toLowerCase() || "";
  const code = name.length === 2 && name.charCodeAt(0) === 104 ? name.charCodeAt(1) : 0;
  return code > 48 && code < 55 ? code - 48 : null;
}

// node_modules/.pnpm/hast-util-to-string@2.0.0/node_modules/hast-util-to-string/index.js
function toString(node) {
  if ("children" in node) {
    return all(node);
  }
  return "value" in node ? node.value : "";
}
function one(node) {
  if (node.type === "text") {
    return node.value;
  }
  return "children" in node ? all(node) : "";
}
function all(node) {
  let index = -1;
  const result = [];
  while (++index < node.children.length) {
    result[index] = one(node.children[index]);
  }
  return result.join("");
}

// node_modules/.pnpm/unist-util-is@5.2.1/node_modules/unist-util-is/lib/index.js
var convert = (
  /**
   * @type {(
   *   (<Kind extends Node>(test: PredicateTest<Kind>) => AssertPredicate<Kind>) &
   *   ((test?: Test) => AssertAnything)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {AssertAnything}
   */
  function(test) {
    if (test === void 0 || test === null) {
      return ok;
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  }
);
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].call(this, ...parameters))
        return true;
    }
    return false;
  }
}
function propsFactory(check) {
  return castFactory(all2);
  function all2(node) {
    let key;
    for (key in check) {
      if (node[key] !== check[key])
        return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(check) {
  return assertion;
  function assertion(node, ...parameters) {
    return Boolean(
      node && typeof node === "object" && "type" in node && // @ts-expect-error: fine.
      Boolean(check.call(this, node, ...parameters))
    );
  }
}
function ok() {
  return true;
}

// node_modules/.pnpm/unist-util-visit-parents@5.1.3/node_modules/unist-util-visit-parents/lib/color.js
function color(d) {
  return "\x1B[33m" + d + "\x1B[39m";
}

// node_modules/.pnpm/unist-util-visit-parents@5.1.3/node_modules/unist-util-visit-parents/lib/index.js
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
var visitParents = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor<Node>} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function(tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    const is2 = convert(test);
    const step = reverse ? -1 : 1;
    factory(tree, void 0, [])();
    function factory(node, index, parents) {
      const value = node && typeof node === "object" ? node : {};
      if (typeof value.type === "string") {
        const name = (
          // `hast`
          typeof value.tagName === "string" ? value.tagName : (
            // `xast`
            typeof value.name === "string" ? value.name : void 0
          )
        );
        Object.defineProperty(visit2, "name", {
          value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")"
        });
      }
      return visit2;
      function visit2() {
        let result = [];
        let subresult;
        let offset;
        let grandparents;
        if (!test || is2(node, index, parents[parents.length - 1] || null)) {
          result = toResult(visitor(node, parents));
          if (result[0] === EXIT) {
            return result;
          }
        }
        if (node.children && result[0] !== SKIP) {
          offset = (reverse ? node.children.length : -1) + step;
          grandparents = parents.concat(node);
          while (offset > -1 && offset < node.children.length) {
            subresult = factory(node.children[offset], offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
        return result;
      }
    }
  }
);
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return [value];
}

// node_modules/.pnpm/unist-util-visit@4.1.2/node_modules/unist-util-visit/lib/index.js
var visit = (
  /**
   * @type {(
   *   (<Tree extends Node, Check extends Test>(tree: Tree, test: Check, visitor: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined) => void) &
   *   (<Tree extends Node>(tree: Tree, visitor: BuildVisitor<Tree>, reverse?: boolean | null | undefined) => void)
   * )}
   */
  /**
   * @param {Node} tree
   * @param {Test} test
   * @param {Visitor} visitor
   * @param {boolean | null | undefined} [reverse]
   * @returns {void}
   */
  function(tree, test, visitor, reverse) {
    if (typeof test === "function" && typeof visitor !== "function") {
      reverse = visitor;
      visitor = test;
      test = null;
    }
    visitParents(tree, test, overload, reverse);
    function overload(node, parents) {
      const parent = parents[parents.length - 1];
      return visitor(
        node,
        parent ? parent.children.indexOf(node) : null,
        parent
      );
    }
  }
);

// node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js
var slugs = new Slugger();
function rehypeSlug(options = {}) {
  const prefix = options.prefix || "";
  return (tree) => {
    slugs.reset();
    visit(tree, "element", (node) => {
      if (headingRank(node) && node.properties && !hasProperty(node, "id")) {
        node.properties.id = prefix + slugs.slug(toString(node));
      }
    });
  };
}

// src/node/plugin-mdx/pluginMdxRollup.ts
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkFrontMatter from "remark-frontmatter";
import remarkMdxFrontMatter from "remark-mdx-frontmatter";

// src/node/plugin-mdx/rehypePlugins/preWrapper.ts
var rehypePluginPreWrapper = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "pre" && node.children[0].type === "element" && node.children[0].tagName === "code" && !node.data?.isVisited) {
        const codeChild = node.children[0];
        const nodeClassName = codeChild.properties?.className?.toString() || "";
        const lang = nodeClassName.split("-")[1];
        const cloneNode = {
          type: "element",
          tagName: "pre",
          children: node.children,
          data: {
            isVisited: true
          },
          properties: node.properties
        };
        node.tagName = "div";
        node.properties = node.properties || {};
        node.properties.className = nodeClassName;
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: {
              className: "lang"
            },
            children: [
              {
                type: "text",
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

// src/node/plugin-mdx/rehypePlugins/rehypePluginShiki.ts
import { fromHtml } from "hast-util-from-html";
var rehypePluginShiki = ({ highlight }) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "pre" && node.children[0].type === "element" && node.children[0].tagName === "code") {
        const codeNode = node.children[0];
        const content = codeNode.children[0].value;
        const codeClassName = codeNode.properties?.className?.toString() || "";
        const lang = codeClassName.split("-")[1];
        if (!lang) {
          return;
        }
        const highlightCode = highlight.codeToHtml(content, { lang });
        const fragmentAST = fromHtml(highlightCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAST.children);
      }
    });
  };
};

// src/node/plugin-mdx/pluginMdxRollup.ts
import shiki from "shiki";

// src/node/plugin-mdx/remarkPlugin/toc.ts
import Slugger2 from "github-slugger";
import { parse } from "acorn";
var remarkPluginToc = () => {
  return (tree) => {
    const toc = [];
    const slugger = new Slugger2();
    visit(tree, "heading", (node) => {
      if (!node.depth || !node.children) {
        return;
      }
      if (node.depth > 1 && node.depth < 5) {
        const originText = node.children.map((child) => {
          switch (child.type) {
            case "link":
              return child.children.map((c) => c.value).join("") || "";
            default:
              return child.value;
          }
        }).join("");
        const id = slugger.slug(originText);
        toc.push({
          id,
          depth: node.depth,
          text: originText
        });
      }
    });
    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)}`;
    tree.children.push({
      type: "mdxjsEsm",
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: "module"
        })
      }
    });
  };
};

// src/node/plugin-mdx/pluginMdxRollup.ts
async function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkPluginGRF,
      remarkFrontMatter,
      [remarkMdxFrontMatter, { name: "frontmatter" }],
      remarkPluginToc
    ],
    rehypePlugins: [
      //增加锚点
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            class: "head-anch"
          },
          content: {
            type: "text",
            value: "#"
          }
        }
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          highlight: await shiki.getHighlighter({ theme: "nord" })
        }
      ]
    ]
  });
}

// src/node/plugin-mdx/pluginMdxHmr.ts
import assert from "assert";
function pluginMdxHmr() {
  let vitePluginReact;
  return {
    name: "vite-plugin-mdx-hmr",
    apply: "serve",
    //用于开发环境
    configResolved(config) {
      vitePluginReact = config.plugins.find(
        (plugin) => plugin.name === "vite:react-babel"
      );
    },
    async transform(code, id, opts) {
      if (/\.mdx?/.test(id)) {
        assert(typeof vitePluginReact.transform === "function");
        const result = await vitePluginReact.transform?.call(
          this,
          code,
          id + "?.jsx",
          opts
        );
        const selfAcceptCode = "import.meta.hot.accept();";
        if (typeof result === "object" && !result.code?.includes(selfAcceptCode)) {
          result.code += selfAcceptCode;
        }
        return result;
      }
    },
    handleHotUpdate(ctx) {
      if (/\.mdx?$/.test(ctx.file)) {
        ctx.server.ws.send({
          type: "custom",
          event: "mdx-change",
          data: {
            file: ctx.file
          }
        });
      }
    }
  };
}

// src/node/plugin-mdx/index.ts
async function createPluginMdx() {
  return [await pluginMdxRollup(), pluginMdxHmr()];
}

// src/node/vitePlugins.ts
import pluginUnocss from "unocss/vite";

// src/node/unocssOption.ts
import { presetAttributify, presetIcons, presetWind } from "unocss";
var unocssOption = {
  presets: [presetAttributify(), presetIcons(), presetWind({})],
  shortcuts: {
    "flex-center": "flex justify-center items-center"
  },
  theme: {
    colors: {
      brandLight: "var(--island-c-brand-light)",
      brandDark: "var(--island-c-brand-dark)",
      brand: "var(--island-c-brand)",
      text: {
        1: "var(--island-c-text-1)",
        2: "var(--island-c-text-2)",
        3: "var(--island-c-text-3)",
        4: "var(--island-c-text-4)"
      },
      divider: {
        default: "var(--island-c-divider)",
        light: "var(--island-c-divider-light)",
        dark: "var(--island-c-divider-dark)"
      },
      gray: {
        light: {
          1: "var(--island-c-gray-light-1)",
          2: "var(--island-c-gray-light-2)",
          3: "var(--island-c-gray-light-3)",
          4: "var(--island-c-gray-light-4)"
        }
      },
      bg: {
        default: "var(--island-c-bg)",
        soft: "var(--island-c-bg-soft)",
        mute: "var(--island-c-bg-mute)"
      }
    }
  },
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: "1px solid var(--island-c-divider-light)"
      })
    ],
    [
      "menu-item-before",
      {
        "margin-right": "12px",
        "margin-left": "12px",
        width: "1px",
        height: "24px",
        "background-color": "var(--island-c-divider-light)",
        content: '" "'
      }
    ]
  ]
};

// src/node/babel-plugin-island.ts
import { declare } from "@babel/helper-plugin-utils";
import { types as t } from "@babel/core";
import { normalizePath as normalizePath2 } from "vite";
var babel_plugin_island_default = declare((api) => {
  api.assertVersion(7);
  const visitor = {
    //访问JSX标签
    JSXOpeningElement(path2, state) {
      const name = path2.node.name;
      let bindingName = "";
      if (name.type === "JSXIdentifier") {
        bindingName = name.name;
      } else if (name.type === "JSXMemberExpression") {
        let object = name.object;
        while (t.isJSXMemberExpression(object)) {
          object = object.object;
        }
        bindingName = object.name;
      } else {
        return;
      }
      const binding = path2.scope.getBinding(bindingName);
      if (binding?.path.parent.type === "ImportDeclaration") {
        const source = binding.path.parent.source;
        const attributes = path2.container.openingElement.attributes;
        for (let i = 0; i < attributes.length; i++) {
          const name2 = attributes[i].name;
          if (name2?.name === "__island") {
            attributes[i].value = t.stringLiteral(
              `${source.value}${MASK_SPLITTER}${normalizePath2(
                state.filename || ""
              )}`
            );
          }
        }
      }
    }
  };
  return {
    name: "transform-jsx-island",
    visitor
  };
});

// src/node/vitePlugins.ts
import { join as join3 } from "path";
async function createVitePlugins(config, restart, isSSR = false) {
  return [
    pluginUnocss(unocssOption),
    PluginIndexHtml(),
    pluginReact({
      jsxRuntime: "automatic",
      jsxImportSource: isSSR ? join3(PACKAGE_ROOT, "src", "runtime") : "react",
      babel: {
        plugins: [babel_plugin_island_default]
      }
    }),
    pluginConfig(config, restart),
    PluginRoutes({ root: config.root, isSSR }),
    await createPluginMdx()
  ];
}

export {
  PACKAGE_ROOT,
  CLIENT_ENTRY_PATH,
  SERVER_ENTRY_PATH,
  MASK_SPLITTER,
  CLIENT_OUTPUT,
  createVitePlugins
};
