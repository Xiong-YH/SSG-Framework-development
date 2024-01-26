import { a as jsx, j as jsxs, F as Fragment } from "./client-entry.be75cc9c.js";
import Counter from "./Counter.3b19eebb.js";
const frontmatter = {
  "title": "custom title"
};
const toc = [{
  "id": "autolink-literals-1",
  "depth": 2,
  "text": "Autolink literals"
}, {
  "id": "footnote-1",
  "depth": 2,
  "text": "Footnote"
}, {
  "id": "strikethrough-1",
  "depth": 2,
  "text": "Strikethrough"
}, {
  "id": "table-1",
  "depth": 2,
  "text": "Table"
}, {
  "id": "tasklist-1",
  "depth": 2,
  "text": "Tasklist"
}, {
  "id": "-1",
  "depth": 2,
  "text": ""
}, {
  "id": "link-1",
  "depth": 3,
  "text": "link"
}];
function _createMdxContent(props) {
  const _components = Object.assign({
    h1: "h1",
    a: "a",
    h2: "h2",
    p: "p",
    sup: "sup",
    del: "del",
    table: "table",
    thead: "thead",
    tr: "tr",
    th: "th",
    tbody: "tbody",
    td: "td",
    ul: "ul",
    li: "li",
    input: "input",
    div: "div",
    span: "span",
    pre: "pre",
    code: "code",
    h3: "h3",
    section: "section",
    ol: "ol"
  }, props.components);
  return jsxs(Fragment, {
    children: [jsxs(_components.h1, {
      id: "gfm",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#gfm",
        children: "#"
      }), "GFM"]
    }), "\n", jsxs(_components.h2, {
      id: "autolink-literals",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#autolink-literals",
        children: "#"
      }), "Autolink literals"]
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.a, {
        href: "http://www.example.com",
        children: "www.example.com"
      }), ", ", jsx(_components.a, {
        href: "https://example.com",
        children: "https://example.com"
      }), ", and ", jsx(_components.a, {
        href: "mailto:contact@example.com",
        children: "contact@example.com"
      }), "."]
    }), "\n", jsxs(_components.h2, {
      id: "footnote",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#footnote",
        children: "#"
      }), "Footnote"]
    }), "\n", jsxs(_components.p, {
      children: ["A note", jsx(_components.sup, {
        children: jsx(_components.a, {
          href: "#user-content-fn-1",
          id: "user-content-fnref-1",
          "data-footnote-ref": true,
          "aria-describedby": "footnote-label",
          children: "1"
        })
      })]
    }), "\n", jsxs(_components.h2, {
      id: "strikethrough",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#strikethrough",
        children: "#"
      }), "Strikethrough"]
    }), "\n", jsxs(_components.p, {
      children: [jsx(_components.del, {
        children: "one"
      }), " or ", jsx(_components.del, {
        children: "two"
      }), " tildes."]
    }), "\n", jsxs(_components.h2, {
      id: "table",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#table",
        children: "#"
      }), "Table"]
    }), "\n", jsxs(_components.table, {
      children: [jsx(_components.thead, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.th, {
            children: "a"
          }), jsx(_components.th, {
            align: "left",
            children: "b"
          }), jsx(_components.th, {
            align: "right",
            children: "c"
          }), jsx(_components.th, {
            align: "center",
            children: "d"
          })]
        })
      }), jsx(_components.tbody, {
        children: jsxs(_components.tr, {
          children: [jsx(_components.td, {
            children: "1"
          }), jsx(_components.td, {
            align: "left",
            children: "2"
          }), jsx(_components.td, {
            align: "right",
            children: "3"
          }), jsx(_components.td, {
            align: "center",
            children: "4"
          })]
        })
      })]
    }), "\n", jsxs(_components.h2, {
      id: "tasklist",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#tasklist",
        children: "#"
      }), "Tasklist"]
    }), "\n", jsxs(_components.ul, {
      className: "contains-task-list",
      children: ["\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          disabled: true
        }), " ", "to do 1ass"]
      }), "\n", jsxs(_components.li, {
        className: "task-list-item",
        children: [jsx(_components.input, {
          type: "checkbox",
          checked: true,
          disabled: true
        }), " ", "done"]
      }), "\n"]
    }), "\n", jsxs(_components.div, {
      className: "language-ts",
      children: [jsx(_components.span, {
        className: "lang",
        children: "ts"
      }), jsx(_components.pre, {
        className: "shiki",
        style: {
          backgroundColor: "#2e3440ff"
        },
        children: jsxs(_components.code, {
          children: [jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "Plugin"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "vite"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ";"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "import"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9"
              },
              children: "pluginMdxRollup"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "from"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#A3BE8C"
              },
              children: "./pluginMdxRollup"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "'"
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsx(_components.span, {
            className: "line"
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "export"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "async"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "function"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "pluginMdx"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "()"
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ":"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "Promise"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "<"
            }), jsx(_components.span, {
              style: {
                color: "#8FBCBB"
              },
              children: "Plugin"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "[]"
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: ">"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "{"
            })]
          }), "\n", jsxs(_components.span, {
            className: "line",
            children: [jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "  "
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "return"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " ["
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: "await"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: " "
            }), jsx(_components.span, {
              style: {
                color: "#88C0D0"
              },
              children: "pluginMdxRollup"
            }), jsx(_components.span, {
              style: {
                color: "#D8DEE9FF"
              },
              children: "()]"
            }), jsx(_components.span, {
              style: {
                color: "#81A1C1"
              },
              children: ";"
            })]
          }), "\n", jsx(_components.span, {
            className: "line",
            children: jsx(_components.span, {
              style: {
                color: "#ECEFF4"
              },
              children: "}"
            })
          }), "\n", jsx(_components.span, {
            className: "line"
          })]
        })
      })]
    }), "\n", jsx(_components.h2, {
      id: "",
      children: jsx(_components.a, {
        className: "head-anch",
        href: "#",
        children: "#"
      })
    }), "\n", "\n", jsx(Counter, {}), "\n", jsxs(_components.h3, {
      id: "link",
      children: [jsx(_components.a, {
        className: "head-anch",
        href: "#link",
        children: "#"
      }), jsx(_components.a, {
        href: "/path",
        children: "link"
      })]
    }), "\n", "\n", jsxs(_components.section, {
      "data-footnotes": true,
      className: "footnotes",
      children: [jsxs(_components.h2, {
        className: "sr-only",
        id: "footnote-label",
        children: [jsx(_components.a, {
          className: "head-anch",
          href: "#footnote-label",
          children: "#"
        }), "Footnotes"]
      }), "\n", jsxs(_components.ol, {
        children: ["\n", jsxs(_components.li, {
          id: "user-content-fn-1",
          children: ["\n", jsxs(_components.p, {
            children: ["Big note. ", jsx(_components.a, {
              href: "#user-content-fnref-1",
              "data-footnote-backref": true,
              className: "data-footnote-backref",
              "aria-label": "Back to content",
              children: "\u21A9"
            })]
          }), "\n"]
        }), "\n"]
      }), "\n"]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = props.components || {};
  return MDXLayout ? jsx(MDXLayout, Object.assign({}, props, {
    children: jsx(_createMdxContent, props)
  })) : _createMdxContent(props);
}
export {
  MDXContent as default,
  frontmatter,
  toc
};
