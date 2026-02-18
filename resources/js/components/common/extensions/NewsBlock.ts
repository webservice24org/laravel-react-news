import { Node, mergeAttributes } from "@tiptap/core"

export type NewsBlockAttrs = {
  title: string
  href: string
  image: string
  label?: string
  date?: string
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    newsBlock: {
      insertNewsBlock: (attrs: NewsBlockAttrs) => ReturnType
    }
  }
}

export const NewsBlock = Node.create({
  name: "newsBlock",

  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      title: { default: "" },
      href: { default: "" },
      image: { default: "" },
      label: { default: "আরও পড়ুন" },
      date: { default: "" },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="news-block"]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    // Keep a clean DOM for storage (NodeView controls the UI)
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "news-block",
        "data-title": node.attrs.title || "",
        "data-href": node.attrs.href || "",
        "data-image": node.attrs.image || "",
        "data-label": node.attrs.label || "",
        "data-date": node.attrs.date || "",
      }),
    ]
  },

  addCommands() {
    return {
      insertNewsBlock:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    }
  },
})
