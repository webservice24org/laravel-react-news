import { Node, mergeAttributes } from "@tiptap/core"

export const ClearFloat = Node.create({
  name: "clearFloat",

  group: "block",
  atom: true,
  selectable: false,

  parseHTML() {
    return [{ tag: "div[data-clear-float]" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-clear-float": "true",
        style: "clear: both;",
      }),
    ]
  },

  addCommands() {
    return {
      insertClearFloat:
        () =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name })
        },
    }
  },
})
