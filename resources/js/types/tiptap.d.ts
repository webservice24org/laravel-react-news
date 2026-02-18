import "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    clearFloat: {
      insertClearFloat: () => ReturnType
    }
  }
}
