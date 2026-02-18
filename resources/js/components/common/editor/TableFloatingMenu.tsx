"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import type { Editor as TiptapEditor } from "@tiptap/react"
import { Trash2, Columns2, Rows2, SplitSquareHorizontal, Combine } from "lucide-react"

type Props = {
  editor: TiptapEditor
  containerRef: React.RefObject<HTMLDivElement>
}

type Pos = { left: number; top: number; visible: boolean }

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function TableFloatingMenu({ editor, containerRef }: Props) {
  const [pos, setPos] = useState<Pos>({ left: 0, top: 0, visible: false })
  const rafRef = useRef<number | null>(null)

  const btnClass = useMemo(
    () =>
      "inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-neutral-100 hover:bg-neutral-800 transition",
    []
  )

  const prevent = (e: React.MouseEvent) => e.preventDefault()

  const updatePosition = () => {
    const root = containerRef.current
    if (!root) return

    const isInTable = editor.isActive("table")
    if (!isInTable) {
      setPos((p) => ({ ...p, visible: false }))
      return
    }

    // Find the DOM table element under selection
    const { from } = editor.state.selection
    const domAt = editor.view.domAtPos(from)
    const node = (domAt.node as HTMLElement)?.nodeType === 3 ? (domAt.node.parentElement as HTMLElement) : (domAt.node as HTMLElement)
    const table = node?.closest?.("table") as HTMLTableElement | null

    if (!table) {
      setPos((p) => ({ ...p, visible: false }))
      return
    }

    // Position menu relative to editor container
    const rootRect = root.getBoundingClientRect()
    const tableRect = table.getBoundingClientRect()

    const left = tableRect.left - rootRect.left + tableRect.width / 2
    const top = tableRect.top - rootRect.top - 40 // above table

    const nextLeft = clamp(left, 80, rootRect.width - 80)

    setPos({ left: nextLeft, top: top < 0 ? 8 : top, visible: true })
  }

  useEffect(() => {
    if (!editor) return

    const schedule = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(updatePosition)
    }

    // Update on selection changes and transactions
    editor.on("selectionUpdate", schedule)
    editor.on("transaction", schedule)
    window.addEventListener("resize", schedule)

    // initial
    schedule()

    return () => {
      editor.off("selectionUpdate", schedule)
      editor.off("transaction", schedule)
      window.removeEventListener("resize", schedule)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [editor])

  if (!pos.visible) return null

  return (
    <div
      className="absolute z-50"
      style={{
        left: pos.left,
        top: pos.top,
        transform: "translateX(-50%)",
      }}
    >
      <div className="flex items-center gap-1 rounded-md border border-neutral-700 bg-neutral-950 shadow px-1 py-1">
        {/* Row controls */}
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="Add row before"
        >
          <Rows2 size={14} />
          +Row↑
        </button>
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="Add row after"
        >
          <Rows2 size={14} />
          +Row↓
        </button>
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().deleteRow().run()}
          title="Delete row"
        >
          <Rows2 size={14} />
          −Row
        </button>

        <div className="mx-1 h-5 w-px bg-neutral-700" />

        {/* Column controls */}
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="Add column before"
        >
          <Columns2 size={14} />
          +Col←
        </button>
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="Add column after"
        >
          <Columns2 size={14} />
          +Col→
        </button>
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().deleteColumn().run()}
          title="Delete column"
        >
          <Columns2 size={14} />
          −Col
        </button>

        <div className="mx-1 h-5 w-px bg-neutral-700" />

        {/* Merge / Split */}
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().mergeCells().run()}
          title="Merge cells"
        >
          <Combine size={14} />
          Merge
        </button>
        <button
          className={btnClass}
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().splitCell().run()}
          title="Split cell"
        >
          <SplitSquareHorizontal size={14} />
          Split
        </button>

        <div className="mx-1 h-5 w-px bg-neutral-700" />

        {/* Delete table */}
        <button
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-300 hover:bg-red-950/40 transition"
          onMouseDown={prevent}
          onClick={() => editor.chain().focus().deleteTable().run()}
          title="Delete table"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  )
}
