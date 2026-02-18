"use client"

import React, { useMemo } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { ExternalLink, Pencil, Trash2 } from "lucide-react"

function safeHref(href: string) {
  const v = (href || "").trim()
  if (!v) return ""
  if (v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://")) return v
  return `https://${v}`
}

function formatBanglaDate(dateIsoOrText: string) {
  const v = (dateIsoOrText || "").trim()
  if (!v) {
    try {
      return new Date().toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return new Date().toDateString()
    }
  }
  const d = new Date(v)
  if (!Number.isNaN(d.getTime())) {
    try {
      return d.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    } catch {
      return d.toDateString()
    }
  }
  return v
}

export default function NewsBlockView(props: NodeViewProps) {
  const { node, editor, getPos } = props
  const attrs = node.attrs as any

  const label = (attrs.label || "আরও পড়ুন") as string
  const title = (attrs.title || "") as string
  const href = safeHref(attrs.href || "")
  const image = (attrs.image || "") as string
  const dateText = useMemo(() => formatBanglaDate(attrs.date || ""), [attrs.date])

  const canInteract = editor.isEditable

  const openLink = () => {
    if (!href) return
    window.open(href, "_blank", "noopener,noreferrer")
  }

  const selectNode = () => {
    const pos = typeof getPos === "function" ? getPos() : null
    if (typeof pos !== "number") return
    editor.commands.setNodeSelection(pos)
  }

  const onCardMouseDown = (e: React.MouseEvent) => {
    // Block ProseMirror from placing a text cursor inside card
    e.preventDefault()

    // Ctrl/Cmd click opens the link
    if ((e.metaKey || e.ctrlKey) && href) {
      openLink()
      return
    }

    // Normal click selects node
    selectNode()
  }

  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canInteract) return

    const pos = typeof getPos === "function" ? getPos() : null
    if (typeof pos !== "number") return

    editor.commands.command(({ tr }) => {
      tr.delete(pos, pos + node.nodeSize)
      return true
    })
  }

  const onEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!canInteract) return

    const pos = typeof getPos === "function" ? getPos() : null
    if (typeof pos !== "number") return

    window.dispatchEvent(
      new CustomEvent("tiptap:newsblock-edit", {
        detail: { pos, attrs: { ...attrs } },
      })
    )
  }

  return (
    <NodeViewWrapper className="not-prose my-3">
      <div
        className={[
          "group relative rounded-md border border-neutral-700 bg-neutral-200/90 text-neutral-900",
          "cursor-pointer select-none hover:bg-neutral-200",
        ].join(" ")}
        onMouseDown={onCardMouseDown}
        title={href ? "Click to select • Ctrl/Cmd + Click to open" : "Click to select"}
      >
        {/* ✅ REAL anchor tag (so href exists in DOM) */}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            // Prevent normal click from opening (we handle open ourselves)
            onClick={(e) => e.preventDefault()}
            // Make it cover the whole card (optional)
            className="absolute inset-0 z-1"
            aria-label={title || "Open news link"}
          />
        )}

        {/* Action buttons - must be above anchor */}
        {canInteract && (
          <div
            className="absolute right-2 top-2 z-3 hidden items-center gap-1 rounded-md border border-neutral-300 bg-white/85 p-1 shadow group-hover:flex"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            {/* Open button (works without Ctrl/Cmd) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openLink()
              }}
              className="inline-flex items-center justify-center rounded p-1 hover:bg-neutral-200"
              title="Open link"
              disabled={!href}
            >
              <ExternalLink size={16} />
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center rounded p-1 hover:bg-neutral-200"
              title="Edit"
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center justify-center rounded p-1 hover:bg-red-100 text-red-600"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        {/* Content (must be above anchor too) */}
        <div className="relative z-2 flex items-stretch gap-3 p-4">
          <div className="flex-1">
            <div className="text-sm font-semibold text-neutral-700">{label}</div>
            <div className="mt-1 text-lg font-bold leading-snug">{title || "—"}</div>
            <div className="mt-2 text-sm text-neutral-700">{dateText}</div>

            {href && (
              <div className="mt-2 text-xs text-neutral-600">
                Ctrl/Cmd + Click to open
              </div>
            )}
          </div>

          <div className="flex w-27.5 items-center justify-center">
            <div className="w-18 overflow-hidden rounded-md border border-neutral-300 bg-white">
              {image ? (
                <img src={image} alt="" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  )
}
