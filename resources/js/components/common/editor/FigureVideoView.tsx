"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { AlignLeft, AlignCenter, AlignRight, Trash2, Replace } from "lucide-react"

type Align = "left" | "center" | "right"

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function px(n: number) {
  return `${Math.round(n)}px`
}

export default function FigureVideoView(props: NodeViewProps) {
  const { node, selected, updateAttributes, deleteNode, editor, getPos } = props

  const src: string = node.attrs.src ?? ""
  const caption: string = node.attrs.caption ?? ""
  const align: Align = (node.attrs.align as Align) ?? "center"
  const width: string = node.attrs.width ?? "100%"
  const height: string = node.attrs.height ?? "360px"

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)

  const [hovered, setHovered] = useState(false)
  const [toolbarHovered, setToolbarHovered] = useState(false)

  const showUI = hovered || toolbarHovered || selected

  /* ---------------- Float layout (same as image) ---------------- */
  const figureStyle = useMemo<React.CSSProperties>(() => {
    if (align === "left" || align === "right") {
      return {
        float: align,
        margin: "0.25rem 1rem 0.75rem 0",
        textAlign: align,
        maxWidth: "100%",
      }
    }
    return {
      float: "none",
      margin: "0.75rem 0",
      textAlign: "center",
      maxWidth: "100%",
    }
  }, [align])

  /* ---------------- Size style ---------------- */
  const frameStyle = useMemo<React.CSSProperties>(() => {
    return {
      width: width || "100%",
      height: height || "360px",
      maxWidth: "100%",
      margin: align === "center" ? "0 auto" : undefined,
    }
  }, [width, height, align])

  const setAlign = (a: Align) => updateAttributes({ align: a })

  /* ---------------- Replace: tell Editor to open dialog on this node ---------------- */
  const requestReplace = () => {
    // make sure THIS node is selected
    try {
      const pos = typeof getPos === "function" ? getPos() : null
      if (typeof pos === "number") editor.commands.setNodeSelection(pos)

      window.dispatchEvent(
        new CustomEvent("tiptap:video-replace", {
          detail: {
            pos,
            src,
            caption,
          },
        })
      )
    } catch (e) {
      console.error(e)
    }
  }

  /* ---------------- Resize handle (width + height) ---------------- */
  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const frame = frameRef.current
    if (!frame) return

    // select the node so Delete works etc
    try {
      const pos = typeof getPos === "function" ? getPos() : null
      if (typeof pos === "number") editor.commands.setNodeSelection(pos)
    } catch {}

    const startX = e.clientX
    const startY = e.clientY
    const rect = frame.getBoundingClientRect()
    const startW = rect.width
    const startH = rect.height

    const parentWidth = wrapperRef.current?.parentElement?.getBoundingClientRect().width ?? 900

    const onMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY

      // clamp
      const newW = clamp(startW + dx, 240, Math.min(1200, parentWidth))
      const newH = clamp(startH + dy, 135, 900)

      updateAttributes({ width: px(newW), height: px(newH) })
    }

    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  return (
    <NodeViewWrapper
      ref={wrapperRef as any}
      className={[
        "relative my-2 rounded-md",
        selected ? "ring-2 ring-blue-500/70" : "ring-1 ring-transparent",
        "transition",
        "max-w-full",
      ].join(" ")}
      style={figureStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-drag-handle
    >
      {/* Frame */}
      <div
        ref={frameRef}
        style={frameStyle}
        className={[
          "relative overflow-hidden rounded-md border border-neutral-700 bg-neutral-950",
        ].join(" ")}
      >
        {/* Toolbar INSIDE the frame (no blinking) */}
        <div
          className={[
            "absolute top-2 right-2 z-20",
            "flex items-center gap-1 rounded-md",
            "border border-neutral-700 bg-neutral-900/95 shadow",
            "px-1 py-1",
            "transition-opacity",
            showUI ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onMouseEnter={() => setToolbarHovered(true)}
          onMouseLeave={() => setToolbarHovered(false)}
          onMouseDown={(ev) => ev.preventDefault()}
        >
          <ToolbarBtn title="Wrap left" active={align === "left"} onClick={() => setAlign("left")}>
            <AlignLeft size={16} />
          </ToolbarBtn>
          <ToolbarBtn title="Center" active={align === "center"} onClick={() => setAlign("center")}>
            <AlignCenter size={16} />
          </ToolbarBtn>
          <ToolbarBtn title="Wrap right" active={align === "right"} onClick={() => setAlign("right")}>
            <AlignRight size={16} />
          </ToolbarBtn>

          <div className="mx-1 h-4 w-px bg-neutral-700" />

          <ToolbarBtn title="Replace" onClick={requestReplace}>
            <Replace size={16} />
          </ToolbarBtn>

          <ToolbarBtn title="Delete" danger onClick={deleteNode}>
            <Trash2 size={16} />
          </ToolbarBtn>
        </div>

        <iframe
          src={src}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />

        {/* Resize handle */}
        <div
          className={[
            "absolute bottom-1 right-1 z-20",
            "h-4 w-4 rounded-sm",
            "bg-neutral-900/80 border border-neutral-700",
            "cursor-nwse-resize",
            "transition-opacity",
            showUI ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onMouseDown={onResizeMouseDown}
          title="Resize"
        />
      </div>

      {/* Caption (click to edit like image view usually) */}
      <div className="mt-2">
        <button
          type="button"
          className={[
            "block w-full text-center",
            "text-xs text-neutral-300/90 hover:text-neutral-100",
            "px-2 py-1 rounded",
            "hover:bg-neutral-800/60 transition",
          ].join(" ")}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const next = window.prompt("Caption", caption ?? "")
            if (next !== null) updateAttributes({ caption: next })
          }}
          title="Edit caption"
        >
          {caption?.length ? caption : "Add caption…"}
        </button>
      </div>
    </NodeViewWrapper>
  )
}

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
