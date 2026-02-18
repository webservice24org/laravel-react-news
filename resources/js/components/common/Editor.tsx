"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  type Editor as TiptapEditor,
} from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"

import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"

// ✅ Lists
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"

// ✅ Colors + Highlight
import { TextStyle } from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"

// ✅ Tables (use TableKit to match Tiptap DOM + resizing)
import { TableKit } from "@tiptap/extension-table"

// ✅ ProseMirror PluginKeys (IMPORTANT: stable + not created inside component)
import { PluginKey } from "prosemirror-state"

// ✅ Custom nodes
import { FigureImage } from "@/components/common/extensions/FigureImage"
import FigureImageView from "@/components/common/editor/FigureImageView"
import { ClearFloat } from "@/components/common/extensions/ClearFloat"

// ✅ Video
import { FigureVideo } from "@/components/common/extensions/FigureVideo"
import FigureVideoView from "@/components/common/editor/FigureVideoView"
import { VideoInsertDialog } from "@/components/common/editor/VideoInsertDialog"

// ✅ Table UI
import { TableBubbleMenu, TableEdgePlusControls } from "@/components/common/editor/TableUI"

// ✅ News Block
import NewsBlockView from "@/components/common/editor/NewsBlockView"
import { NewsBlock } from "@/components/common/extensions/NewsBlock"
import { NewsBlockInsertDialog } from "@/components/common/editor/NewsBlockInsertDialog"

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink2,
  ExternalLink,
  Image as ImageIcon,
  Quote,
  Video,
  Undo,
  Redo,
  SeparatorHorizontal,
  ChevronDown,
  UploadCloud,
  Palette,
  Highlighter,
  RotateCcw,
  Table2,
  Newspaper,
  Wand2,
  Save,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

declare function route(name: string, params?: any): string

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    color: {
      setColor: (color: string) => ReturnType
      unsetColor: () => ReturnType
    }
  }
}

interface EditorProps {
  value: string
  onChange: (html: string) => void
}

/** ✅ Stable plugin keys (DO NOT create inside component) */
const linkBubbleKey = new PluginKey("link-bubble-menu")

/* ---------------- CSRF helper ---------------- */
function getCsrfToken(): string {
  const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
  return el?.content ?? ""
}

/* ---------------- Upload with progress (XHR) ---------------- */
function uploadImageToServerWithProgress(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const form = new FormData()
    form.append("file", file)

    xhr.open("POST", route("admin.uploads.images"), true)
    xhr.withCredentials = true
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.setRequestHeader("X-CSRF-TOKEN", getCsrfToken())

    xhr.upload.onprogress = (evt) => {
      if (!evt.lengthComputable) return
      onProgress(Math.round((evt.loaded / evt.total) * 100))
    }

    xhr.onload = () => {
      try {
        if (xhr.status < 200 || xhr.status >= 300) {
          reject(new Error(xhr.responseText || "Upload failed"))
          return
        }
        const json = JSON.parse(xhr.responseText) as { url: string }
        resolve(json.url)
      } catch (e) {
        reject(e)
      }
    }

    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}

/* ---------------- Code view: basic pretty formatter ---------------- */
/** Note: simple/robust enough for admin editing; won’t crash on weird HTML. */
function prettyHtml(html: string) {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html || "", "text/html")
    const body = doc.body

    const voidTags = new Set([
      "area", "base", "br", "col", "embed", "hr", "img", "input",
      "link", "meta", "param", "source", "track", "wbr",
    ])
    const inlineTags = new Set([
      "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
      "em", "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong",
      "sub", "sup", "time", "u", "var",
      "img", "input", "label",
    ])

    const cleanText = (t: string) => t.replace(/\s+/g, " ").trim()

    const attrsToString = (el: Element) => {
      const parts: string[] = []
      for (const a of Array.from(el.attributes)) {
        if (!a.value) parts.push(a.name)
        else parts.push(`${a.name}="${a.value.replace(/"/g, "&quot;")}"`)
      }
      return parts.length ? " " + parts.join(" ") : ""
    }

    const formatNode = (node: Node, indent: number): string => {
      const pad = "  ".repeat(indent)

      if (node.nodeType === Node.TEXT_NODE) {
        const txt = cleanText(node.textContent || "")
        return txt ? pad + txt : ""
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return ""

      const el = node as Element
      const tag = el.tagName.toLowerCase()
      const attrs = attrsToString(el)

      const children = Array.from(el.childNodes).filter((n) => {
        if (n.nodeType === Node.TEXT_NODE) return cleanText(n.textContent || "") !== ""
        return true
      })

      // inline-only: keep on one line if possible
      const isInline = inlineTags.has(tag)
      if (isInline) {
        let inner = ""
        for (const c of children) {
          if (c.nodeType === Node.TEXT_NODE) inner += (c.textContent || "")
          else inner += (c as Element).outerHTML
        }
        inner = inner.trim()
        if (voidTags.has(tag)) return `${pad}<${tag}${attrs}>`
        return `${pad}<${tag}${attrs}>${inner}</${tag}>`
      }

      if (voidTags.has(tag)) return `${pad}<${tag}${attrs}>`

      if (children.length === 0) return `${pad}<${tag}${attrs}></${tag}>`

      const childLines = children
        .map((c) => formatNode(c, indent + 1))
        .filter(Boolean)

      // If all children are text and short, keep one line
      const allText = children.every((c) => c.nodeType === Node.TEXT_NODE)
      if (allText) {
        const txt = cleanText(el.textContent || "")
        if (txt.length <= 80) return `${pad}<${tag}${attrs}>${txt}</${tag}>`
      }

      return [
        `${pad}<${tag}${attrs}>`,
        ...childLines,
        `${pad}</${tag}>`,
      ].join("\n")
    }

    const lines: string[] = []
    for (const n of Array.from(body.childNodes)) {
      const out = formatNode(n, 0)
      if (out) lines.push(out)
    }
    return lines.join("\n\n").trim() + "\n"
  } catch {
    return html
  }
}

/* ---------------- BlockType Dropdown ---------------- */
function BlockTypeDropdown({ editor }: { editor: TiptapEditor }) {
  const currentLabel = (() => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1"
    if (editor.isActive("heading", { level: 2 })) return "Heading 2"
    if (editor.isActive("heading", { level: 3 })) return "Heading 3"
    return "Paragraph"
  })()

  const setParagraph = () => editor.chain().focus().setParagraph().run()
  const setHeading = (level: 1 | 2 | 3) =>
    editor.chain().focus().toggleHeading({ level }).run()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-900"
        >
          <span className="min-w-27.5 text-left">{currentLabel}</span>
          <ChevronDown size={16} className="text-neutral-300" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-60 border-neutral-800 bg-neutral-950 p-1"
      >
        <DropdownMenuItem
          onClick={setParagraph}
          className={[
            "cursor-pointer rounded px-2 py-2",
            editor.isActive("paragraph")
              ? "bg-blue-600/30"
              : "hover:bg-neutral-900",
          ].join(" ")}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-white">Paragraph</span>
            <span className="text-xs text-neutral-400">Shift+Alt+7</span>
          </div>
        </DropdownMenuItem>

        {[1, 2, 3].map((lvl) => (
          <DropdownMenuItem
            key={lvl}
            onClick={() => setHeading(lvl as 1 | 2 | 3)}
            className={[
              "cursor-pointer rounded px-2 py-2",
              editor.isActive("heading", { level: lvl })
                ? "bg-blue-600/30"
                : "hover:bg-neutral-900",
            ].join(" ")}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={[
                  "text-white leading-none",
                  lvl === 1
                    ? "text-xl font-bold"
                    : lvl === 2
                      ? "text-lg font-semibold"
                      : "text-base font-semibold",
                ].join(" ")}
              >
                Heading {lvl}
              </span>
              <span className="text-xs text-neutral-400">Shift+Alt+{lvl}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------------- WP-like Color Presets ---------------- */
const TEXT_COLOR_PRESETS = [
  { name: "Default", value: "" },
  { name: "White", value: "#ffffff" },
  { name: "Blue", value: "#60a5fa" },
  { name: "Green", value: "#34d399" },
  { name: "Yellow", value: "#facc15" },
  { name: "Red", value: "#f87171" },
  { name: "Purple", value: "#c084fc" },
]

const HIGHLIGHT_PRESETS = [
  { name: "None", value: "" },
  { name: "Yellow", value: "#fde047" },
  { name: "Green", value: "#86efac" },
  { name: "Blue", value: "#93c5fd" },
  { name: "Pink", value: "#f9a8d4" },
  { name: "Orange", value: "#fdba74" },
]

function ColorDropdown({
  title,
  icon,
  current,
  presets,
  onPick,
  onClear,
}: {
  title: string
  icon: React.ReactNode
  current: string
  presets: { name: string; value: string }[]
  onPick: (value: string) => void
  onClear: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={title}
          className="rounded p-1.5 hover:bg-neutral-800 transition flex items-center gap-2"
        >
          {icon}
          <span
            className="h-3 w-3 rounded-sm border border-neutral-600"
            style={{ background: current || "transparent" }}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-55 border-neutral-800 bg-neutral-950 p-1"
      >
        {presets.map((p) => (
          <DropdownMenuItem
            key={p.name}
            onClick={() => (!p.value ? onClear() : onPick(p.value))}
            className="cursor-pointer rounded px-2 py-2 hover:bg-neutral-900"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-neutral-100">{p.name}</span>
              <span
                className="h-4 w-8 rounded border border-neutral-700"
                style={{ background: p.value || "transparent" }}
              />
            </div>
          </DropdownMenuItem>
        ))}

        <div className="px-2 py-2">
          <div className="text-xs text-neutral-400 mb-2">Custom</div>
          <input
            type="color"
            className="h-9 w-full cursor-pointer rounded border border-neutral-800 bg-neutral-950"
            value={current || "#ffffff"}
            onChange={(e) => onPick(e.target.value)}
          />
        </div>

        <DropdownMenuItem
          onClick={onClear}
          className="cursor-pointer rounded px-2 py-2 hover:bg-neutral-900 text-neutral-200"
        >
          <RotateCcw className="mr-2" size={16} />
          Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/* ---------------- Image Insert Dialog (kept inline) ---------------- */
function ImageInsertDialog({
  trigger,
  disabled,
  onInsertFigure,
}: {
  trigger: React.ReactNode
  disabled?: boolean
  onInsertFigure: (payload: { src: string; alt?: string; caption?: string }) => void
}) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string>("")
  const [url, setUrl] = useState("")
  const [alt, setAlt] = useState("")
  const [caption, setCaption] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const [loading, setLoading] = useState(false)

  const reset = () => {
    setFile(null)
    setFilePreview("")
    setUrl("")
    setAlt("")
    setCaption("")
    setDragOver(false)
    setUploadPct(0)
    setLoading(false)
  }

  const close = () => {
    setOpen(false)
    reset()
  }

  const pickFile = (f: File) => {
    if (!f.type.startsWith("image/")) return
    setFile(f)
    setUrl("")
    setFilePreview(URL.createObjectURL(f))
  }

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  const canSubmit = (!!file || !!url.trim()) && !loading

  const submit = async () => {
    if (!canSubmit) return
    try {
      setLoading(true)

      if (file) {
        setUploadPct(0)
        const uploadedUrl = await uploadImageToServerWithProgress(file, setUploadPct)
        onInsertFigure({
          src: uploadedUrl,
          alt: alt.trim() || undefined,
          caption: caption.trim() || "",
        })
        close()
        return
      }

      onInsertFigure({
        src: url.trim(),
        alt: alt.trim() || undefined,
        caption: caption.trim() || "",
      })
      close()
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  const urlPreview = url.trim()

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-neutral-100">
        <DialogHeader>
          <DialogTitle>Insert image</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Drag & drop an image, browse from device, or paste an image URL.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div
            className={[
              "rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-8 text-center",
              dragOver ? "ring-2 ring-blue-500/60" : "",
            ].join(" ")}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOver(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOver(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOver(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragOver(false)
              const dropped = e.dataTransfer.files?.[0]
              if (dropped) pickFile(dropped)
            }}
          >
            <div className="text-neutral-300">
              Drag & Drop your files or{" "}
              <label className="cursor-pointer font-semibold underline underline-offset-4">
                Browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ""
                    if (f) pickFile(f)
                  }}
                  disabled={disabled || loading}
                />
              </label>
            </div>

            {loading && file && (
              <div className="mt-4">
                <div className="h-2 w-full overflow-hidden rounded bg-neutral-800">
                  <div
                    className="h-2 bg-blue-600 transition-all"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-neutral-400">{uploadPct}%</div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/20 p-3">
            <div className="text-sm font-medium text-neutral-200 mb-2">Preview</div>
            <div className="aspect-video w-full overflow-hidden rounded-md border border-neutral-800 bg-neutral-950 flex items-center justify-center">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="h-full w-full object-contain" />
              ) : urlPreview ? (
                <img src={urlPreview} alt="Preview" className="h-full w-full object-contain" />
              ) : (
                <div className="text-xs text-neutral-500">No image selected</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alt text</Label>
          <Input
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the image for accessibility"
            className="bg-neutral-950 border-neutral-800"
            disabled={disabled || loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Caption (optional)</Label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption (shows under the image)"
            className="bg-neutral-950 border-neutral-800"
            disabled={disabled || loading}
          />
        </div>

        <div className="space-y-2">
          <Label>Image URL (optional)</Label>
          <Input
            value={url}
            onChange={(e) => {
              const v = e.target.value
              setUrl(v)
              if (v.trim()) {
                setFile(null)
                if (filePreview) URL.revokeObjectURL(filePreview)
                setFilePreview("")
                setUploadPct(0)
              }
            }}
            placeholder="https://example.com/image.jpg"
            className="bg-neutral-950 border-neutral-800"
            disabled={disabled || loading}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700"
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button type="button" onClick={submit} disabled={!canSubmit || disabled}>
            {loading ? "Uploading..." : "Insert"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ===================================================== */

type ViewMode = "visual" | "code"

export default function Editor({ value, onChange }: EditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [openInNewTab, setOpenInNewTab] = useState(true)

  // ✅ Visual | Code
  const [viewMode, setViewMode] = useState<ViewMode>("visual")
  const [codeHtml, setCodeHtml] = useState(value)
  const [codeBaseline, setCodeBaseline] = useState(value)
  const [codeError, setCodeError] = useState<string>("")

  const codeDirty = codeHtml !== codeBaseline

  // ✅ bubble menu readiness (fixes “works only after switching view”)
  const [menusReady, setMenusReady] = useState(false)

  // ✅ Video replace (kept)
  const [videoReplaceOpen, setVideoReplaceOpen] = useState(false)
  const [videoReplacePos, setVideoReplacePos] = useState<number | null>(null)
  const [videoReplaceInitial, setVideoReplaceInitial] = useState<{ src?: string; caption?: string }>({})

  // ✅ News Block dialog + edit support
  const [newsOpen, setNewsOpen] = useState(false)
  const [newsMode, setNewsMode] = useState<"insert" | "edit">("insert")
  const [newsEditPos, setNewsEditPos] = useState<number | null>(null)
  const [newsInitial, setNewsInitial] = useState<{ title?: string; href?: string; image?: string }>({})

  const editorWrapRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: { levels: [1, 2, 3] },
      }),

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-400 underline underline-offset-2 hover:text-blue-300",
          rel: "noopener noreferrer",
        },
      }),

      Underline,
      Subscript,
      Superscript,

      TextStyle,
      Color.configure({ types: ["textStyle"] }),
      Highlight.configure({ multicolor: true }),

      ListItem,
      BulletList.configure({ HTMLAttributes: { class: "list-disc pl-6 my-2" } }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal pl-6 my-2" } }),

      // ✅ Tables
      TableKit.configure({
        table: {
          resizable: true,
          lastColumnResizable: true,
          allowTableNodeSelection: true,
          HTMLAttributes: {},
        },
        tableRow: {},
        tableHeader: {},
        tableCell: {},
      }),

      NewsBlock.extend({
        addNodeView() {
          return ReactNodeViewRenderer(NewsBlockView)
        },
      }),

      // ✅ Image
      FigureImage.extend({
        addNodeView() {
          return ReactNodeViewRenderer(FigureImageView)
        },
      }),

      // ✅ Video
      FigureVideo.extend({
        addNodeView() {
          return ReactNodeViewRenderer(FigureVideoView)
        },
      }),

      ClearFloat,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      if (viewMode === "code" && !codeDirty) {
        setCodeHtml(html)
        setCodeBaseline(html)
      }
    },

    editorProps: {
      handleClick: (_view, _pos, event) => {
        const e = event as MouseEvent
        if (!e.metaKey && !e.ctrlKey) return false
        const target = e.target as HTMLElement | null
        const a = target?.closest("a") as HTMLAnchorElement | null
        if (a?.href) {
          window.open(a.href, "_blank", "noopener,noreferrer")
          return true
        }
        return false
      },

      attributes: {
        class: [
          "tiptap-editor ProseMirror",
          "prose prose-invert max-w-none",
          "text-neutral-100",
          "focus:outline-none min-h-[220px]",
          "space-y-3",

          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-ul:pl-6 prose-ol:pl-6",
          "prose-li:marker:text-neutral-400",

          "prose-h1:text-3xl prose-h1:font-bold prose-h1:leading-tight prose-h1:mt-4 prose-h1:mb-2",
          "prose-h2:text-2xl prose-h2:font-semibold prose-h2:leading-tight prose-h2:mt-4 prose-h2:mb-2",
          "prose-h3:text-xl  prose-h3:font-semibold prose-h3:leading-tight prose-h3:mt-3 prose-h3:mb-2",

          "prose-a:text-blue-400 prose-a:underline prose-a:underline-offset-2 prose-a:hover:text-blue-300",

          // table wrapper
          "prose-table:w-full prose-table:table-fixed",

          // blockquote
          "prose-blockquote:border-l prose-blockquote:border-neutral-700 prose-blockquote:pl-4 prose-blockquote:text-neutral-200 prose-blockquote:italic",
        ].join(" "),
      },
    },
  })

  const isCode = viewMode === "code"

  // ✅ Bubble menus should mount ONLY after EditorContent DOM exists
  useEffect(() => {
    if (!editor) return
    setMenusReady(false)
    const id = requestAnimationFrame(() => setMenusReady(true))
    return () => cancelAnimationFrame(id)
  }, [editor, isCode]) // re-arm on mode changes too

  // ✅ Safe setContent: prevents bad HTML/schema from crashing visual view
  const safeSetVisualContent = (html: string) => {
    if (!editor) return false
    try {
      editor.commands.setContent(html)
      setCodeError("")
      return true
    } catch (e) {
      console.error(e)
      setCodeError("Invalid/unsupported HTML for visual editor. Fix the HTML and try again.")
      return false
    }
  }

  // ✅ NewsBlock edit event
  useEffect(() => {
    if (!editor) return

    const handler = (evt: Event) => {
      const ce = evt as CustomEvent<{ pos?: number; attrs?: any }>
      const pos = typeof ce.detail?.pos === "number" ? ce.detail.pos : null
      if (pos == null) return

      setNewsEditPos(pos)
      setNewsInitial({
        title: ce.detail?.attrs?.title ?? "",
        href: ce.detail?.attrs?.href ?? "",
        image: ce.detail?.attrs?.image ?? "",
      })
      setNewsMode("edit")
      setNewsOpen(true)
    }

    window.addEventListener("tiptap:newsblock-edit", handler as EventListener)
    return () => window.removeEventListener("tiptap:newsblock-edit", handler as EventListener)
  }, [editor])

  // ✅ Sync prop value (safe)
  useEffect(() => {
    if (!editor) return

    if (!isCode) {
      if (editor.getHTML() !== value) {
        safeSetVisualContent(value)
      }
    } else {
      setCodeHtml(value)
      setCodeBaseline(value)
      setCodeError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor, isCode])

  // ✅ Video replace event (kept)
  useEffect(() => {
    if (!editor) return

    const handler = (evt: Event) => {
      const ce = evt as CustomEvent<{ pos?: number | null; src?: string; caption?: string }>
      const pos = typeof ce.detail?.pos === "number" ? ce.detail.pos : null

      setVideoReplacePos(pos)
      setVideoReplaceInitial({
        src: ce.detail?.src ?? "",
        caption: ce.detail?.caption ?? "",
      })
      setVideoReplaceOpen(true)
    }

    window.addEventListener("tiptap:video-replace", handler as EventListener)
    return () => window.removeEventListener("tiptap:video-replace", handler as EventListener)
  }, [editor])

  if (!editor) return null

  const switchToCode = () => {
    const html = editor.getHTML()
    setCodeHtml(html)
    setCodeBaseline(html)
    setCodeError("")
    setViewMode("code")
  }

  const saveCodeToVisual = () => {
    const ok = safeSetVisualContent(codeHtml)
    if (!ok) return false
    setCodeBaseline(codeHtml)
    setCodeError("")
    return true
  }

  const switchToVisual = () => {
    if (codeDirty) {
      const ok = saveCodeToVisual()
      if (!ok) return
    }
    setViewMode("visual")
  }

  /* ---------- Insert helpers ---------- */
  const insertNewsBlock = (payload: { title: string; href: string; image: string }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "newsBlock",
        attrs: {
          title: payload.title,
          href: payload.href,
          image: payload.image,
          label: "আরও পড়ুন",
          date: "",
        },
      })
      .run()
  }

  const updateNewsBlockAtPos = (pos: number, payload: { title: string; href: string; image: string }) => {
    const node = editor.state.doc.nodeAt(pos)
    if (!node || node.type.name !== "newsBlock") return

    const nextAttrs = {
      ...node.attrs,
      title: payload.title,
      href: payload.href,
      image: payload.image,
    }

    editor.commands.command(({ tr }) => {
      tr.setNodeMarkup(pos, undefined, nextAttrs)
      return true
    })
  }

  const insertFigure = (payload: { src: string; alt?: string; caption?: string }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "figureImage",
        attrs: {
          src: payload.src,
          alt: payload.alt ?? "",
          caption: payload.caption ?? "",
          align: "center",
          width: "auto",
        },
      })
      .run()
  }

  const insertVideo = (payload: { src: string; caption?: string }) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: "figureVideo",
        attrs: {
          src: payload.src,
          caption: payload.caption ?? "",
          align: "center",
          width: "100%",
          height: "360px",
        },
      })
      .run()
  }

  const replaceVideoAtPos = (pos: number, attrs: { src: string; caption?: string }) => {
    const node = editor.state.doc.nodeAt(pos)
    if (!node) return
    if (node.type.name !== "figureVideo") return

    const nextAttrs = {
      ...node.attrs,
      src: attrs.src,
      caption: attrs.caption ?? node.attrs.caption ?? "",
    }

    editor.commands.command(({ tr }) => {
      tr.setNodeMarkup(pos, undefined, nextAttrs)
      return true
    })
  }

  const clearFloat = () => editor.chain().focus().insertClearFloat().run()

  // ✅ Text color
  const currentTextColor = (editor.getAttributes("textStyle") as { color?: string })?.color ?? ""
  const setTextColor = (hex: string) => editor.chain().focus().setColor(hex).run()
  const unsetTextColor = () => editor.chain().focus().unsetColor().run()

  // ✅ Highlight
  const currentHighlightColor = (editor.getAttributes("highlight") as { color?: string })?.color ?? ""
  const setHighlightColor = (hex: string) => editor.chain().focus().setHighlight({ color: hex }).run()
  const unsetHighlight = () => editor.chain().focus().unsetHighlight().run()

  // ✅ Link helpers
  const getActiveLinkHref = () => {
    const attrs = editor.getAttributes("link") as { href?: string; target?: string }
    return attrs?.href ?? ""
  }

  const openLinkDialogForInsertOrEdit = () => {
    const href = editor.isActive("link") ? getActiveLinkHref() : ""
    setLinkUrl(href)
    setOpenInNewTab((editor.getAttributes("link") as { target?: string })?.target === "_blank")
    setLinkDialogOpen(true)
  }

  const applyLinkFromDialog = () => {
    const href = linkUrl.trim()
    if (!href) return

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href,
        target: openInNewTab ? "_blank" : undefined,
        rel: openInNewTab ? "noopener noreferrer" : undefined,
      })
      .run()

    setLinkDialogOpen(false)
  }

  const removeLink = () => editor.chain().focus().unsetLink().run()

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }

  return (
    <div className="rounded-lg border bg-neutral-900 text-neutral-100">
      {/* WP-like Top Row */}
      <div className="flex items-center justify-between gap-2 border-b border-neutral-800 p-2">
        <div className="flex items-center gap-2 flex-wrap">
          <BlockTypeDropdown editor={editor} />

          <ImageInsertDialog
            disabled={!editor || isCode}
            onInsertFigure={(payload) => insertFigure(payload)}
            trigger={
              <Button
                type="button"
                variant="secondary"
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
                disabled={isCode}
              >
                <UploadCloud className="mr-2" size={16} />
                Add Media
              </Button>
            }
          />

          <VideoInsertDialog
            disabled={!editor || isCode}
            onInsertVideo={(payload) => insertVideo(payload)}
            trigger={
              <Button
                type="button"
                variant="secondary"
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
                disabled={isCode}
              >
                <Video className="mr-2" size={16} />
                Add Video
              </Button>
            }
          />

          <Button
            type="button"
            variant="secondary"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
            onClick={insertTable}
            disabled={isCode}
          >
            <Table2 className="mr-2" size={16} />
            Insert Table
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
            onClick={() => {
              setNewsMode("insert")
              setNewsEditPos(null)
              setNewsInitial({})
              setNewsOpen(true)
            }}
            disabled={isCode}
          >
            <Newspaper className="mr-2" size={16} />
            News Block
          </Button>
        </div>

        {/* ✅ Visual | Code tabs (top-right like screenshot) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-sm">
            <button
              type="button"
              onClick={switchToVisual}
              className={[
                "px-2 py-1 border border-transparent",
                !isCode ? "bg-white/10 border-neutral-500 text-white" : "text-neutral-300 hover:text-white",
              ].join(" ")}
            >
              Visual
            </button>

            <button
              type="button"
              onClick={switchToCode}
              className={[
                "px-2 py-1 border border-transparent -ml-px",
                isCode ? "bg-white/10 border-neutral-500 text-white" : "text-neutral-300 hover:text-white",
              ].join(" ")}
            >
              Code
            </button>
          </div>

          
        </div>
      </div>

      {/* Toolbar */}
      <div
        className={[
          "flex flex-wrap items-center gap-1 border-b border-neutral-800 p-2",
          isCode ? "opacity-50 pointer-events-none" : "",
        ].join(" ")}
      >
        <Btn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </Btn>
        <Btn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </Btn>
        <Btn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </Btn>
        <Btn active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </Btn>

        <Divider />

        <Btn active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
          <SubIcon size={16} />
        </Btn>
        <Btn active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
          <SuperIcon size={16} />
        </Btn>

        <Divider />

        <Btn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={16} />
        </Btn>
        <Btn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </Btn>
        <Btn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </Btn>

        <Divider />

        <Btn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </Btn>
        <Btn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </Btn>

        <Divider />

        <Btn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={16} />
        </Btn>
        <Btn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={16} />
        </Btn>
        <Btn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={16} />
        </Btn>

        <Divider />

        <Btn title="Insert link" active={editor.isActive("link")} onClick={openLinkDialogForInsertOrEdit}>
          <LinkIcon size={16} />
        </Btn>

        <ImageInsertDialog
          disabled={!editor || isCode}
          onInsertFigure={(payload) => insertFigure(payload)}
          trigger={
            <Btn title="Insert image" onClick={() => {}}>
              <ImageIcon size={16} />
            </Btn>
          }
        />

        <Btn
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={16} />
        </Btn>

        <Divider />

        <ColorDropdown
          title="Text color"
          icon={<Palette size={16} />}
          current={currentTextColor}
          presets={TEXT_COLOR_PRESETS}
          onPick={setTextColor}
          onClear={unsetTextColor}
        />

        <ColorDropdown
          title="Highlight"
          icon={<Highlighter size={16} />}
          current={currentHighlightColor}
          presets={HIGHLIGHT_PRESETS}
          onPick={setHighlightColor}
          onClear={unsetHighlight}
        />

        <Divider />

        <Btn onClick={clearFloat} title="Clear Float">
          <SeparatorHorizontal size={16} />
        </Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={16} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={16} />
        </Btn>
      </div>

      {/* Editor */}
      <div ref={editorWrapRef} className="p-3 relative tiptap-clearfix">
        {isCode ? (
          <div className="rounded-md border border-neutral-800 bg-neutral-950 overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-neutral-800 px-3 py-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
                  onClick={() => {
                    const next = prettyHtml(codeHtml)
                    setCodeHtml(next)
                    onChange(next)
                  }}
                >
                  <Wand2 className="mr-2" size={16} />
                  Format
                </Button>

                {codeDirty && (
                  <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                    onClick={() => {
                      saveCodeToVisual()
                    }}
                  >
                    <Save className="mr-2" size={16} />
                    Save
                  </Button>
                )}
              </div>

              <div className="text-xs text-neutral-400">
                {codeDirty ? "Unsaved changes" : "Saved"}
              </div>
            </div>

            {codeError && (
              <div className="border-b border-neutral-800 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                {codeError}
              </div>
            )}

            <textarea
              value={codeHtml}
              onChange={(e) => {
                const next = e.target.value
                setCodeHtml(next)
                onChange(next)
              }}
              spellCheck={false}
              className="min-h-80 w-full resize-y bg-transparent p-3 font-mono text-sm text-neutral-100 outline-none"
            />
          </div>
        ) : (
          <>
            <EditorContent editor={editor} />

            {/* ✅ Bubble menus MUST be mounted AFTER EditorContent exists */}
            {menusReady && (
              <>
                {/* Link Bubble Menu */}
                <BubbleMenu
                  editor={editor}
                  pluginKey={linkBubbleKey}
                  shouldShow={({ editor }: { editor: TiptapEditor }) => editor.isActive("link")}
                  className="rounded-md border border-neutral-700 bg-neutral-950 shadow px-1 py-1 flex items-center gap-1"
                >
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs hover:bg-neutral-800 inline-flex items-center gap-1"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      const href = (editor.getAttributes("link") as { href?: string })?.href
                      if (href) window.open(href, "_blank", "noopener,noreferrer")
                    }}
                    title="Open"
                  >
                    <ExternalLink size={14} />
                    Open
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs hover:bg-neutral-800 inline-flex items-center gap-1"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={openLinkDialogForInsertOrEdit}
                    title="Edit"
                  >
                    <LinkIcon size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    className="rounded px-2 py-1 text-xs text-red-300 hover:bg-neutral-800 inline-flex items-center gap-1"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={removeLink}
                    title="Remove"
                  >
                    <Unlink2 size={14} />
                    Remove
                  </button>
                </BubbleMenu>

                {/* Table Bubble Menu */}
                <TableBubbleMenu editor={editor} />
              </>
            )}

            <TableEdgePlusControls editor={editor} containerRef={editorWrapRef} />
          </>
        )}
      </div>

      {/* Replace Video dialog */}
      <VideoInsertDialog
        open={videoReplaceOpen}
        onOpenChange={setVideoReplaceOpen}
        mode="replace"
        initial={videoReplaceInitial}
        disabled={!editor || isCode}
        onInsertVideo={({ src, caption }) => {
          if (videoReplacePos == null) return
          replaceVideoAtPos(videoReplacePos, { src, caption })
        }}
      />

      <NewsBlockInsertDialog
        open={newsOpen}
        onOpenChange={setNewsOpen}
        mode={newsMode}
        initial={newsInitial}
        disabled={!editor || isCode}
        onSubmit={({ title, href, image }) => {
          if (newsMode === "edit" && newsEditPos != null) {
            updateNewsBlockAtPos(newsEditPos, { title, href, image })
          } else {
            insertNewsBlock({ title, href, image })
          }
        }}
      />

      {/* Link dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-lg bg-neutral-950 border-neutral-800 text-neutral-100">
          <DialogHeader>
            <DialogTitle>{editor.isActive("link") ? "Edit link" : "Insert link"}</DialogTitle>
            <DialogDescription className="text-neutral-400">
              Apply a link to the selected text.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="bg-neutral-950 border-neutral-800"
              disabled={isCode}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-200">
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="accent-blue-600"
              disabled={isCode}
            />
            Open in new tab
          </label>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700"
              onClick={() => {
                removeLink()
                setLinkDialogOpen(false)
              }}
              disabled={!editor.isActive("link") || isCode}
            >
              <Unlink2 className="mr-2" size={16} />
              Remove
            </Button>

            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="bg-neutral-800 hover:bg-neutral-700">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="button" onClick={applyLinkFromDialog} disabled={!linkUrl.trim() || isCode}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="hidden">{/* keep TS/React happy */}</div>
    </div>
  )
}

/* ---------------- UI helpers ---------------- */
function Btn({
  children,
  onClick,
  title,
  active,
}: {
  children: React.ReactNode
  onClick: () => void
  title?: string
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        "rounded p-1.5 transition",
        active ? "bg-neutral-700" : "hover:bg-neutral-800",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-neutral-700" />
}
