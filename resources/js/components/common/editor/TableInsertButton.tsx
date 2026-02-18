"use client"

import React, { useMemo, useState } from "react"
import type { Editor as TiptapEditor } from "@tiptap/react"
import { Button } from "@/components/ui/button"
import { Table as TableIcon } from "lucide-react"

type Props = {
  editor: TiptapEditor
}

export function TableInsertButton({ editor }: Props) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState<{ rows: number; cols: number }>({ rows: 2, cols: 2 })

  const grid = useMemo(() => {
    const rows = 8
    const cols = 8
    return { rows, cols }
  }, [])

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
        onClick={() => setOpen((s) => !s)}
      >
        <TableIcon className="mr-2" size={16} />
        Insert Table
      </Button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-65 rounded-lg border border-neutral-800 bg-neutral-950 p-3 shadow"
          onMouseLeave={() => setHover({ rows: 2, cols: 2 })}
        >
          <div className="text-xs text-neutral-300 mb-2">
            {hover.rows} × {hover.cols}
          </div>

          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: grid.rows * grid.cols }).map((_, idx) => {
              const r = Math.floor(idx / grid.cols) + 1
              const c = (idx % grid.cols) + 1
              const active = r <= hover.rows && c <= hover.cols

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "h-6 w-6 rounded-sm border transition",
                    active
                      ? "border-blue-500 bg-blue-600/30"
                      : "border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900",
                  ].join(" ")}
                  onMouseEnter={() => setHover({ rows: r, cols: c })}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => insertTable(r, c)}
                  aria-label={`Insert ${r} by ${c} table`}
                />
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-end">
            <button
              type="button"
              className="text-xs text-neutral-400 hover:text-neutral-200"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
