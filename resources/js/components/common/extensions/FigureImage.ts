import Image from "@tiptap/extension-image"
import { mergeAttributes, type Attributes } from "@tiptap/core"

type FigureAlign = "left" | "center" | "right"

type FigureImageAttrs = {
  caption?: string
  align?: FigureAlign
  width?: string
  height?: string
}

export const FigureImage = Image.extend({
  name: "figureImage",

  group: "block",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      ...this.parent?.(),

      caption: {
        default: "",
        parseHTML: (element: HTMLElement) => {
          const figcaption = element.querySelector("figcaption")
          return figcaption?.textContent?.trim() ?? ""
        },
        renderHTML: () => ({}),
      },

      align: {
        default: "center",
        parseHTML: (element: HTMLElement) => {
          const align = element.style.textAlign
          return align === "left" || align === "right" || align === "center"
            ? align
            : "center"
        },
        renderHTML: () => ({}),
      },

      width: {
        default: "auto",
        parseHTML: (element: HTMLElement) => {
          const img = element.querySelector("img")
          return img?.style.width || "auto"
        },
        renderHTML: () => ({}),
      },

      // ✅ NEW: height for free resize
      height: {
        default: "auto",
        parseHTML: (element: HTMLElement) => {
          const img = element.querySelector("img")
          return img?.style.height || "auto"
        },
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return false
          const img = node.querySelector("img")
          if (!img) return false

          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
          }
        },
      },
      {
        tag: "img[src]",
      },
    ]
  },

  renderHTML({
    HTMLAttributes,
  }: {
    HTMLAttributes: Attributes & FigureImageAttrs
  }) {
    const { caption, align, width, height, ...imgAttrs } = HTMLAttributes

    // ✅ float wrap styles for left/right
    const isFloat = align === "left" || align === "right"
    const figureStyle = isFloat
      ? `float:${align}; margin: 0.25rem 1rem 0.75rem 0; text-align:${align};`
      : align === "center"
        ? "text-align:center;"
        : undefined

    const imgStyleParts: string[] = []
    if (width && width !== "auto") imgStyleParts.push(`width:${width};`)
    if (height && height !== "auto") imgStyleParts.push(`height:${height};`)
    const imgStyle = imgStyleParts.length ? imgStyleParts.join(" ") : undefined

    return [
      "figure",
      figureStyle ? { style: figureStyle } : {},
      [
        "img",
        mergeAttributes(imgAttrs, imgStyle ? { style: imgStyle } : {}),
      ],
      caption && caption.length
        ? ["figcaption", { class: "text-sm text-gray-500 mt-1" }, caption]
        : "",
    ]
  },
})
