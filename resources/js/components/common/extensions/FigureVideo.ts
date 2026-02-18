import { Node, mergeAttributes } from "@tiptap/core"

export type VideoAlign = "left" | "center" | "right"

export const FigureVideo = Node.create({
  name: "figureVideo",

  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      caption: { default: "" },
      align: { default: "center" as VideoAlign },
      width: { default: "100%" },   // supports "100%" or "640px"
      height: { default: "360px" }, // supports "360px"
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="figure-video"]',
        getAttrs: (el) => {
          const figure = el as HTMLElement
          const iframe = figure.querySelector("iframe")
          const src = iframe?.getAttribute("src") ?? ""
          const caption = figure.querySelector("figcaption")?.textContent ?? ""
          const align = (figure.getAttribute("data-align") ?? "center") as VideoAlign
          const width = figure.getAttribute("data-width") ?? "100%"
          const height = figure.getAttribute("data-height") ?? "360px"
          return { src, caption, align, width, height }
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src, caption, align, width, height } = HTMLAttributes

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": "figure-video",
        "data-align": align ?? "center",
        "data-width": width ?? "100%",
        "data-height": height ?? "360px",
      }),
      [
        "div",
        { class: "video-frame" },
        [
          "iframe",
          {
            src: src ?? "",
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
          },
        ],
      ],
      caption ? ["figcaption", {}, caption] : ["figcaption", {}, ""],
    ]
  },
})
