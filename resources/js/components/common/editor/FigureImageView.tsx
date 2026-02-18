"use client"

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import toast from "react-hot-toast"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Maximize2,
  Image as ImageIcon,
  RectangleHorizontal,
  AlertTriangle,
} from "lucide-react"

declare function route(name: string, params?: any): string

type Align = "left" | "center" | "right"
type Handle = "nw" | "ne" | "sw" | "se"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/* ---------------- CSRF helper ---------------- */
function getCsrfToken(): string {
  const el = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
  return el?.content ?? ""
}

/* ---------------- Server upload ---------------- */
async function uploadImageToServer(file: File): Promise<string> {
  const form = new FormData()
  form.append("file", file)

  const res = await fetch(route("admin.uploads.images"), {
    method: "POST",
    body: form,
    credentials: "same-origin",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || "Upload failed")
  }

  const json = (await res.json()) as { url: string }
  return json.url
}

  async function deleteImageFromServer(src: string): Promise<void> {
    if (!src) return

    const res = await fetch(route("admin.uploads.images.destroy"), {
      method: "DELETE",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRF-TOKEN": getCsrfToken(),
      },
      body: JSON.stringify({ src }),
    })

    // don't block UX if delete fails
    if (!res.ok) {
      const txt = await res.text().catch(() => "")
      console.warn("Failed to delete old image:", txt)
    }
  }


export default function FigureImageView(props: NodeViewProps) {
  const { node, selected, updateAttributes, deleteNode, editor } = props

  const src: string = node.attrs.src ?? ""
  const caption: string = node.attrs.caption ?? ""
  const align: Align = (node.attrs.align as Align) ?? "center"
  const width: string = node.attrs.width ?? "auto"
  const height: string = node.attrs.height ?? "auto"

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [hovered, setHovered] = useState(false)
  const showUI = hovered || selected

  /* ---------------- Missing image state ----------------
     If file deleted from storage, browser will trigger onError.
     We then hide the figure (no broken <img> shown).
  ------------------------------------------------------ */
  const [missing, setMissing] = useState(false)

  // ✅ Reset missing state when src changes (e.g. replaced image)
  useEffect(() => {
    setMissing(false)
  }, [src])

  /* ---------------- Bubble toolbar positioning ---------------- */
  const [toolbarStyle, setToolbarStyle] = useState<React.CSSProperties>({
    opacity: 0,
    pointerEvents: "none",
  })

  useLayoutEffect(() => {
    if (!showUI || missing) {
      setToolbarStyle({ opacity: 0, pointerEvents: "none" })
      return
    }

    const wrap = wrapperRef.current
    const img = imgRef.current
    if (!wrap || !img) return

    const wrapRect = wrap.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    const centerX = imgRect.left + imgRect.width / 2
    const topY = imgRect.top

    const left = centerX - wrapRect.left
    const top = topY - wrapRect.top

    setToolbarStyle({
      position: "absolute",
      left,
      top,
      transform: "translate(-50%, -110%)",
      opacity: 1,
      pointerEvents: "auto",
    })
  }, [showUI, width, height, align, missing])

  /* ---------------- Caption inline editing ---------------- */
  const [editingCaption, setEditingCaption] = useState(false)
  const [localCaption, setLocalCaption] = useState(caption)

  useEffect(() => setLocalCaption(caption), [caption])

  const commitCaption = () => {
    updateAttributes({ caption: localCaption.trim() })
    setEditingCaption(false)
  }

  /* ---------------- Layout styles ---------------- */
  const figureStyle = useMemo<React.CSSProperties>(() => {
    const base: React.CSSProperties = {
      maxWidth: "100%",
      clear: "both",
    }

    if (align === "left" || align === "right") {
      return {
        ...base,
        float: align,
        textAlign: align,
        marginTop: "0.25rem",
        marginBottom: "0.75rem",
        marginRight: align === "left" ? "1rem" : undefined,
        marginLeft: align === "right" ? "1rem" : undefined,
        display: "block",
        width: "auto",
      }
    }

    return {
      ...base,
      float: "none",
      textAlign: "center",
      margin: "0.75rem auto",
      display: "inline-block",
      width: "fit-content",
    }
  }, [align])

  const imgStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: width === "auto" ? "auto" : width,
      height: height === "auto" ? "auto" : height,
      maxWidth: "100%",
      display: "block",
      margin: align === "center" ? "0 auto" : undefined,
    }
  }, [width, height, align])

  /* ---------------- Toolbar actions ---------------- */
  const setAlignSafe = (a: Align) => {
    if (a === "left" || a === "right") {
      const wrap = wrapperRef.current
      const img = imgRef.current
      if (wrap && img) {
        const wrapRect = wrap.getBoundingClientRect()
        const imgRect = img.getBoundingClientRect()
        const maxFloatW = Math.floor(wrapRect.width * 0.55)

        if (imgRect.width > maxFloatW) {
          const ratio = (img.naturalWidth || imgRect.width) / (img.naturalHeight || imgRect.height)
          const nextW = maxFloatW
          const nextH = Math.round(nextW / ratio)
          updateAttributes({ width: `${nextW}px`, height: `${nextH}px` })
        }
      }
    }

    updateAttributes({ align: a })
  }

  const clearFloat = () => updateAttributes({ align: "center" })
  const resetSize = () => updateAttributes({ width: "auto", height: "auto" })

  const setWidthPreset = (preset: "25%" | "50%" | "100%") => {
    updateAttributes({ width: preset, height: "auto" })
    if (align === "left" || align === "right") setAlignSafe(align)
  }

  const openReplace = () => fileRef.current?.click()

  const onReplacePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const oldSrc = src

    try {
      const url = await uploadImageToServer(file)
      updateAttributes({ src: url })
      toast.success("Image replaced")

      // ✅ delete old file (after successful replace)
      if (oldSrc && oldSrc !== url) {
        deleteImageFromServer(oldSrc)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to replace image")
    }
  }


  /* ---------------- Gutenberg-like resize (4 handles) ---------------- */
  const startResize = (handle: Handle) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const wrap = wrapperRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    if (missing) return

    editor?.commands.focus()

    const wrapRect = wrap.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()

    const startX = e.clientX
    const startY = e.clientY

    const startW = imgRect.width
    const startH = imgRect.height

    const naturalW = img.naturalWidth || startW
    const naturalH = img.naturalHeight || startH
    const ratio = naturalW / naturalH

    const minW = 120
    const minH = 80
    const paddingSafe = 24
    const maxW = Math.max(220, wrapRect.width - paddingSafe)

    const snap = (px: number) => {
      const step = 10
      return Math.round(px / step) * step
    }

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      const sx = handle === "sw" || handle === "nw" ? -1 : 1
      const sy = handle === "ne" || handle === "nw" ? -1 : 1

      let nextW = startW + sx * dx
      let nextH = startH + sy * dy

      nextW = clamp(nextW, minW, maxW)
      nextH = clamp(nextH, minH, 2000)

      if (ev.shiftKey) {
        nextH = nextW / ratio
        nextH = clamp(nextH, minH, 2000)
      }

      nextW = snap(nextW)
      nextH = snap(nextH)

      if (align === "left" || align === "right") {
        const floatMax = Math.floor(wrapRect.width * 0.55)
        nextW = clamp(nextW, minW, floatMax)
        if (ev.shiftKey) nextH = nextW / ratio
      }

      updateAttributes({
        width: `${Math.round(nextW)}px`,
        height: `${Math.round(nextH)}px`,
      })
    }

    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  /* ---------------- If missing: do NOT render <figure><img> ----------------
     ✅ This satisfies: "only show when image available".
     We show a small box (optional) so editor is not confusing.
  ----------------------------------------------------------------------- */
  if (!src || missing) {
    return (
      <NodeViewWrapper
        ref={wrapperRef}
        className={[
          "relative my-2 rounded-md max-w-full",
          "border border-dashed border-red-400/60 bg-red-950/10",
          selected ? "ring-2 ring-blue-500/70" : "",
          "p-3",
        ].join(" ")}
        style={{ maxWidth: "100%" }}
        data-drag-handle
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
          <div className="flex-1">
            <div className="text-sm text-red-200">
              Image missing (file not found in storage).
            </div>
            <div className="text-xs text-red-200/70 mt-1 break-all">
              {src ? src : "No src"}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={openReplace}
                className="inline-flex items-center gap-2 rounded bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 hover:bg-neutral-800 transition"
              >
                <ImageIcon className="h-4 w-4" />
                Replace
              </button>

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  deleteNode()
                  toast.success("Missing image removed")
                }}
                className="inline-flex items-center gap-2 rounded bg-red-900/40 px-3 py-1.5 text-xs text-red-100 hover:bg-red-900/60 transition"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onReplacePick}
        />
      </NodeViewWrapper>
    )
  }

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={[
        "relative my-2 rounded-md max-w-full",
        align === "center" ? "inline-block" : "block",
        selected ? "ring-2 ring-blue-500/70" : "ring-1 ring-transparent",
        "transition",
      ].join(" ")}
      style={figureStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-drag-handle
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onReplacePick}
      />

      {/* Bubble toolbar */}
      <div
        style={toolbarStyle}
        className={[
          "z-20 flex items-center gap-1 rounded-md",
          "border border-neutral-700 bg-neutral-900/95 shadow",
          "px-1 py-1",
        ].join(" ")}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ToolbarBtn title="Wrap left" active={align === "left"} onClick={() => setAlignSafe("left")}>
          <AlignLeft size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Center" active={align === "center"} onClick={() => setAlignSafe("center")}>
          <AlignCenter size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Wrap right" active={align === "right"} onClick={() => setAlignSafe("right")}>
          <AlignRight size={16} />
        </ToolbarBtn>

        <ToolbarBtn title="Clear float" onClick={clearFloat}>
          <RectangleHorizontal size={16} />
        </ToolbarBtn>

        <div className="mx-1 h-4 w-px bg-neutral-700" />

        <ToolbarBtn title="25%" onClick={() => setWidthPreset("25%")}>
          <span className="text-[11px] font-semibold">25%</span>
        </ToolbarBtn>
        <ToolbarBtn title="50%" onClick={() => setWidthPreset("50%")}>
          <span className="text-[11px] font-semibold">50%</span>
        </ToolbarBtn>
        <ToolbarBtn title="100%" onClick={() => setWidthPreset("100%")}>
          <span className="text-[11px] font-semibold">100%</span>
        </ToolbarBtn>

        <div className="mx-1 h-4 w-px bg-neutral-700" />

        <ToolbarBtn title="Replace image" onClick={openReplace}>
          <ImageIcon size={16} />
        </ToolbarBtn>

        <ToolbarBtn title="Reset size" onClick={resetSize}>
          <Maximize2 size={16} />
        </ToolbarBtn>

        <ToolbarBtn
          title="Delete"
          danger
          onClick={async () => {
            const current = src
            deleteNode()
            toast.success("Image removed")
            if (current) deleteImageFromServer(current)
          }}
        >
          <Trash2 size={16} />
        </ToolbarBtn>

      </div>

      {/* Image */}
      <div className="relative inline-block max-w-full">
        <img
          ref={imgRef}
          src={src}
          alt={caption || "Image"}
          style={imgStyle}
          className="rounded-md border border-neutral-700 bg-neutral-950"
          draggable={false}
          onError={() => {
            // ✅ File deleted or URL invalid
            setMissing(true)
          }}
        />

        {/* 4 resize handles */}
        {showUI && (
          <>
            <HandleBtn pos="nw" onMouseDown={startResize("nw")} />
            <HandleBtn pos="ne" onMouseDown={startResize("ne")} />
            <HandleBtn pos="sw" onMouseDown={startResize("sw")} />
            <HandleBtn pos="se" onMouseDown={startResize("se")} />
          </>
        )}

        {/* Caption */}
        <div className="mt-2">
          {!editingCaption ? (
            <button
              type="button"
              className={[
                "block w-full text-center",
                "text-xs text-neutral-300/90 hover:text-neutral-100",
                "px-2 py-1 rounded",
                "hover:bg-neutral-800/60 transition",
              ].join(" ")}
              onClick={() => setEditingCaption(true)}
              title="Click to edit caption"
            >
              {caption?.length ? caption : "Add caption…"}
            </button>
          ) : (
            <div className="flex justify-center gap-2">
              <input
                autoFocus
                value={localCaption}
                onChange={(e) => setLocalCaption(e.target.value)}
                onBlur={commitCaption}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    commitCaption()
                  }
                  if (e.key === "Escape") {
                    e.preventDefault()
                    setLocalCaption(caption)
                    setEditingCaption(false)
                  }
                }}
                className={[
                  "w-[320px] max-w-[80vw]",
                  "rounded-md border border-neutral-700 bg-neutral-900",
                  "px-2 py-1 text-xs text-neutral-100",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                ].join(" ")}
                placeholder="Write caption…"
              />
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={commitCaption}
                className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 transition"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  )
}

/* ---------------- Toolbar button ---------------- */
function ToolbarBtn({
  children,
  onClick,
  title,
  active,
  danger,
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={[
        "rounded p-1.5 transition",
        active ? "bg-neutral-700" : "hover:bg-neutral-800",
        danger ? "text-red-400 hover:text-red-300" : "text-neutral-200",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

/* ---------------- 4-corner handle ---------------- */
function HandleBtn({
  pos,
  onMouseDown,
}: {
  pos: "nw" | "ne" | "sw" | "se"
  onMouseDown: (e: React.MouseEvent) => void
}) {
  const base = "absolute z-10 h-3.5 w-3.5 rounded-sm bg-neutral-900 border border-neutral-600"

  const positionClass =
    pos === "nw"
      ? "-top-2 -left-2 cursor-nwse-resize"
      : pos === "ne"
      ? "-top-2 -right-2 cursor-nesw-resize"
      : pos === "sw"
      ? "-bottom-2 -left-2 cursor-nesw-resize"
      : "-bottom-2 -right-2 cursor-nwse-resize"

  return (
    <button
      type="button"
      className={`${base} ${positionClass}`}
      onMouseDown={onMouseDown}
      title="Resize (Shift = lock ratio)"
    />
  )
}
