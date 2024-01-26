"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }




var _chunkC3FDWALXjs = require('./chunk-C3FDWALX.js');


var _chunkICQFTZDUjs = require('./chunk-ICQFTZDU.js');

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin-island/indexHtml.ts
var _promises = require('fs/promises');
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
              src: `/@fs/${_chunkC3FDWALXjs.CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await _promises.readFile.call(void 0, _chunkC3FDWALXjs.DEFAULT_TEMPLATE_PATH, "utf-8");
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
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);

// src/node/plugin-router/RouteService.ts
var _fastglob = require('fast-glob'); var _fastglob2 = _interopRequireDefault(_fastglob);
var _path = require('path');

var RouteService = class {
  #scanDir;
  #routeData = [];
  constructor(scanDir) {
    this.#scanDir = scanDir;
  }
  async init() {
    const files = _fastglob2.default.sync(["**/*.{js.ts,jsx,tsx,md,mdx}"], {
      cwd: this.#scanDir,
      absolute: true,
      ignore: ["**/node_modules/**", "**/build/**", "config.ts"]
    }).sort();
    files.forEach((file) => {
      const fileRelativePath = _vite.normalizePath.call(void 0, _path.relative.call(void 0, this.#scanDir, file));
      const routePath = this.normalizeRoutePath(fileRelativePath);
      this.#routeData.push({
        absolutePath: file,
        routePath
      });
    });
  }
  normalizeRoutePath(rawPath) {
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }
  generateRouteCode() {
    return `
    import React from 'react';
    import loadable from '@loadable/component';
    ${this.#routeData.map((route, index) => {
      return `const Route${index} = loadable(()=>import('${route.absolutePath}'))`;
    }).join("\n")}
    export const routes = [
        ${this.#routeData.map((route, index) => {
      return `{ path: '${route.routePath}', element: React.createElement(Route${index}) }`;
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
        return routeService.generateRouteCode();
      }
    }
  };
}

// src/node/plugin-mdx/pluginMdxRollup.ts
var _rollup = require('@mdx-js/rollup'); var _rollup2 = _interopRequireDefault(_rollup);
var _remarkgfm = require('remark-gfm'); var _remarkgfm2 = _interopRequireDefault(_remarkgfm);

// node_modules/.pnpm/rehype-slug@5.1.0/node_modules/rehype-slug/index.js
var _githubslugger = require('github-slugger'); var _githubslugger2 = _interopRequireDefault(_githubslugger);

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
var slugs = new (0, _githubslugger2.default)();
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
var _rehypeautolinkheadings = require('rehype-autolink-headings'); var _rehypeautolinkheadings2 = _interopRequireDefault(_rehypeautolinkheadings);
var _remarkfrontmatter = require('remark-frontmatter'); var _remarkfrontmatter2 = _interopRequireDefault(_remarkfrontmatter);
var _remarkmdxfrontmatter = require('remark-mdx-frontmatter'); var _remarkmdxfrontmatter2 = _interopRequireDefault(_remarkmdxfrontmatter);

// src/node/plugin-mdx/rehypePlugins/preWrapper.ts
var rehypePluginPreWrapper = () => {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "pre" && node.children[0].type === "element" && node.children[0].tagName === "code" && !_optionalChain([node, 'access', _ => _.data, 'optionalAccess', _2 => _2.isVisited])) {
        const codeChild = node.children[0];
        const nodeClassName = _optionalChain([codeChild, 'access', _3 => _3.properties, 'optionalAccess', _4 => _4.className, 'optionalAccess', _5 => _5.toString, 'call', _6 => _6()]) || "";
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
var _hastutilfromhtml = require('hast-util-from-html');
var rehypePluginShiki = ({ highlight }) => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "pre" && node.children[0].type === "element" && node.children[0].tagName === "code") {
        const codeNode = node.children[0];
        const content = codeNode.children[0].value;
        const codeClassName = _optionalChain([codeNode, 'access', _7 => _7.properties, 'optionalAccess', _8 => _8.className, 'optionalAccess', _9 => _9.toString, 'call', _10 => _10()]) || "";
        const lang = codeClassName.split("-")[1];
        if (!lang) {
          return;
        }
        const highlightCode = highlight.codeToHtml(content, { lang });
        const fragmentAST = _hastutilfromhtml.fromHtml.call(void 0, highlightCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAST.children);
      }
    });
  };
};

// src/node/plugin-mdx/pluginMdxRollup.ts
var _shiki = require('shiki'); var _shiki2 = _interopRequireDefault(_shiki);

// src/node/plugin-mdx/remarkPlugin/toc.ts

var _acorn = require('acorn');
var slugger = new (0, _githubslugger2.default)();
var remarkPluginToc = () => {
  return (tree) => {
    const toc = [];
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
        estree: _acorn.parse.call(void 0, insertCode, {
          ecmaVersion: 2020,
          sourceType: "module"
        })
      }
    });
  };
};

// src/node/plugin-mdx/pluginMdxRollup.ts
async function pluginMdxRollup() {
  return _rollup2.default.call(void 0, {
    remarkPlugins: [
      _remarkgfm2.default,
      _remarkfrontmatter2.default,
      [_remarkmdxfrontmatter2.default, { name: "frontmatter" }],
      remarkPluginToc
    ],
    rehypePlugins: [
      //增加锚点
      rehypeSlug,
      [
        _rehypeautolinkheadings2.default,
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
          highlight: await _shiki2.default.getHighlighter({ theme: "nord" })
        }
      ]
    ]
  });
}

// src/node/plugin-mdx/pluginMdxHmr.ts
var _assert = require('assert'); var _assert2 = _interopRequireDefault(_assert);
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
        _assert2.default.call(void 0, typeof vitePluginReact.transform === "function");
        const result = await _optionalChain([vitePluginReact, 'access', _11 => _11.transform, 'optionalAccess', _12 => _12.call, 'call', _13 => _13(
          this,
          code,
          id + "?.jsx",
          opts
        )]);
        const selfAcceptCode = "import.meta.hot.accept();";
        if (typeof result === "object" && !_optionalChain([result, 'access', _14 => _14.code, 'optionalAccess', _15 => _15.includes, 'call', _16 => _16(selfAcceptCode)])) {
          result.code += selfAcceptCode;
        }
        return result;
      }
    }
  };
}

// src/node/plugin-mdx/index.ts
async function createPluginMdx() {
  return [await pluginMdxRollup(), pluginMdxHmr()];
}

// src/node/vitePlugins.ts
async function createVitePlugins(config, restart) {
  return [
    PluginIndexHtml(),
    _pluginreact2.default.call(void 0, ),
    _chunkC3FDWALXjs.pluginConfig.call(void 0, config, restart),
    PluginRoutes({ root: config.root }),
    await createPluginMdx()
  ];
}

// src/node/dev.ts
async function createDevServer(root, restart) {
  const config = await _chunkICQFTZDUjs.resolveConfig.call(void 0, root, "serve", "development");
  return _vite.createServer.call(void 0, {
    root: _chunkC3FDWALXjs.PACKAGE_ROOT,
    plugins: await createVitePlugins(config, restart)
  });
}


exports.createDevServer = createDevServer;
