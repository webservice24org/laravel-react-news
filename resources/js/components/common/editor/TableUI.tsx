"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { Editor as TiptapEditor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus" // ✅ correct import for v3
import {
  Plus,
  Trash2,
  Columns2,
  Rows3,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ArrowDownToLine,
} from "lucide-react"
import { PluginKey } from "prosemirror-state"

type Rect = { left: number; top: number; width: number; height: number }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

/** ✅ editor.view access can throw during mount/unmount. */
function hasView(editor: TiptapEditor) {
  try {
    return !!editor?.view && !!editor.view.dom
  } catch {
    return false
  }
}

function safeDomAtPos(editor: TiptapEditor, pos: number) {
  try {
    if (!hasView(editor)) return null
    return editor.view.domAtPos(pos)
  } catch {
    return null
  }
}

function getTableWrapperFromSelection(editor: TiptapEditor): HTMLDivElement | null {
  if (!editor || !hasView(editor)) return null

  const { from } = editor.state.selection
  const domAt = safeDomAtPos(editor, from)
  if (!domAt) return null

  const node =
    domAt.node.nodeType === 3
      ? (domAt.node.parentElement as Element | null)
      : (domAt.node as Element | null)

  if (!node) return null

  const td = node.closest("td,th")
  if (!td) return null

  return td.closest(".tableWrapper") as HTMLDivElement | null
}

function getActiveCell(editor: TiptapEditor): HTMLTableCellElement | null {
  if (!editor || !hasView(editor)) return null

  const { from } = editor.state.selection
  const domAt = safeDomAtPos(editor, from)
  if (!domAt) return null

  const el =
    domAt.node.nodeType === 3
      ? (domAt.node.parentElement as Element | null)
      : (domAt.node as Element | null)

  if (!el) return null

  return el.closest("td,th") as HTMLTableCellElement | null
}

const tableBubbleKey = new PluginKey("table-bubble-menu")

/**
 * Bubble menu anchored to the table top-center.
 * ✅ Tiptap v3: pass getReferenceClientRect via tippyOptions (NOT direct prop)
 */
export function TableBubbleMenu({ editor }: { editor: TiptapEditor }) {
  const getReferenceClientRect = useMemo(() => {
    return () => {
      const wrapper = getTableWrapperFromSelection(editor)
      if (wrapper) {
        const r = wrapper.getBoundingClientRect()
        return new DOMRect(r.left + r.width / 2, r.top, 0, 0)
      }

      // ✅ safe fallback (editor.view may not exist yet)
      try {
        if (!hasView(editor)) return new DOMRect(0, 0, 0, 0)
        const r = editor.view.dom.getBoundingClientRect()
        return new DOMRect(r.left, r.top, 0, 0)
      } catch {
        return new DOMRect(0, 0, 0, 0)
      }
    }
  }, [editor])

  const btn =
    "inline-flex items-center justify-center rounded-md p-1.5 hover:bg-neutral-800 transition"
  const prevent = (e: React.MouseEvent) => e.preventDefault()

  if (!editor) return null

  return (
    <BubbleMenu
      editor={editor}
      pluginKey={tableBubbleKey}
      shouldShow={({ editor }) => {
        // ✅ prevents "editor view is not available" during mount/unmount
        if (!hasView(editor)) return false
        return (
          editor.isActive("table") ||
          editor.isActive("tableCell") ||
          editor.isActive("tableHeader")
        )
      }}
      
      className="flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-950 shadow px-2 py-1"
    >
      {/* Rows */}
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add row before"
      >
        <ArrowUpToLine size={16} />
      </button>
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row after"
      >
        <ArrowDownToLine size={16} />
      </button>
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete row"
      >
        <Rows3 size={16} />
      </button>

      <div className="mx-1 h-5 w-px bg-neutral-700" />

      {/* Columns */}
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add column before"
      >
        <ArrowLeftToLine size={16} />
      </button>
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column after"
      >
        <ArrowRightToLine size={16} />
      </button>
      <button
        className={btn}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete column"
      >
        <Columns2 size={16} />
      </button>

      <div className="mx-1 h-5 w-px bg-neutral-700" />

      {/* Delete table */}
      <button
        className="inline-flex items-center justify-center rounded-md p-1.5 hover:bg-red-950/40 text-red-300 transition"
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete table"
      >
        <Trash2 size={16} />
      </button>
    </BubbleMenu>
  )
}

/**
 * “+” buttons like the Tiptap demo.
 */
export function TableEdgePlusControls({
  editor,
  containerRef,
}: {
  editor: TiptapEditor
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  const [wrapperRect, setWrapperRect] = useState<Rect | null>(null)
  const [cellRect, setCellRect] = useState<Rect | null>(null)
  const rafRef = useRef<number | null>(null)

  const recompute = () => {
    const container = containerRef.current
    if (!container) return

    // ✅ if editor view not ready, do nothing
    if (!editor || !hasView(editor)) return
    if (!editor.isActive("table")) {
      setWrapperRect(null)
      setCellRect(null)
      return
    }

    const wrapper = getTableWrapperFromSelection(editor)
    const cell = getActiveCell(editor)
    if (!wrapper || !cell) {
      setWrapperRect(null)
      setCellRect(null)
      return
    }

    const c = container.getBoundingClientRect()
    const w = wrapper.getBoundingClientRect()
    const td = cell.getBoundingClientRect()

    setWrapperRect({
      left: w.left - c.left,
      top: w.top - c.top,
      width: w.width,
      height: w.height,
    })

    setCellRect({
      left: td.left - c.left,
      top: td.top - c.top,
      width: td.width,
      height: td.height,
    })
  }

  // Track selection changes + scrolling/resizing
  useEffect(() => {
    if (!editor) return

    const onAny = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(recompute)
    }

    editor.on("selectionUpdate", onAny)
    editor.on("transaction", onAny)

    window.addEventListener("resize", onAny)
    window.addEventListener("scroll", onAny, true)

    // ✅ run once after mount (but safe)
    onAny()

    return () => {
      editor.off("selectionUpdate", onAny)
      editor.off("transaction", onAny)
      window.removeEventListener("resize", onAny)
      window.removeEventListener("scroll", onAny, true)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  // recompute on mouse move inside editor
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(recompute)
    }

    container.addEventListener("mousemove", onMove)
    return () => container.removeEventListener("mousemove", onMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])

  if (!wrapperRect || !cellRect || !editor?.isActive("table")) return null

  const size = 24
  const half = size / 2

  const rightX = wrapperRect.left + wrapperRect.width - half
  const rightY = clamp(
    cellRect.top + cellRect.height / 2,
    wrapperRect.top + half,
    wrapperRect.top + wrapperRect.height - half
  )

  const bottomX = clamp(
    cellRect.left + cellRect.width / 2,
    wrapperRect.left + half,
    wrapperRect.left + wrapperRect.width - half
  )
  const bottomY = wrapperRect.top + wrapperRect.height - half

  const base =
    "absolute z-20 flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-neutral-100 shadow hover:bg-neutral-800 transition"

  const prevent = (e: React.MouseEvent) => e.preventDefault()

  return (
    <>
      <button
        type="button"
        className={base}
        style={{
          width: size,
          height: size,
          left: rightX - half,
          top: rightY - half,
          pointerEvents: "auto",
        }}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add column"
      >
        <Plus size={16} />
      </button>

      <button
        type="button"
        className={base}
        style={{
          width: size,
          height: size,
          left: bottomX - half,
          top: bottomY - half,
          pointerEvents: "auto",
        }}
        onMouseDown={prevent}
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add row"
      >
        <Plus size={16} />
      </button>
    </>
  )
}
