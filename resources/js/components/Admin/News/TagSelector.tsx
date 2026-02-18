"use client"

import { useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Tag = { id: number; name: string }

function normalizeName(s: string) {
  return (s || "").trim().replace(/\s+/g, " ")
}

function keyOf(s: string) {
  return normalizeName(s).toLowerCase()
}

export default function TagSelector({
  data,
  setData,
  tags = [],
  errors = {},
}: {
  data: any
  setData: (key: any, value: any) => void
  tags: Tag[]
  errors?: any
}) {
  const [input, setInput] = useState("")
  const [open, setOpen] = useState(false)

  const selectedIds: number[] = Array.isArray(data.tags) ? data.tags.map(Number) : []
  const newTags: string[] = Array.isArray(data.new_tags) ? data.new_tags : []

  const selectedExisting = useMemo(() => {
    const map = new Map(tags.map((t) => [t.id, t]))
    return selectedIds.map((id) => map.get(id)).filter(Boolean) as Tag[]
  }, [selectedIds, tags])

  const suggestions = useMemo(() => {
    const q = keyOf(input)
    if (!q) return []
    return tags
      .filter((t) => keyOf(t.name).includes(q))
      .slice(0, 10)
  }, [input, tags])

  const existsInSelected = (name: string) => {
    const k = keyOf(name)
    const inExisting = selectedExisting.some((t) => keyOf(t.name) === k)
    const inNew = newTags.some((t) => keyOf(t) === k)
    return inExisting || inNew
  }

  const addExisting = (tag: Tag) => {
    if (!selectedIds.includes(tag.id)) {
      setData("tags", [...selectedIds, tag.id])
    }
    setInput("")
    setOpen(false)
  }

  const addNew = (nameRaw: string) => {
    const name = normalizeName(nameRaw)
    if (!name) return

    // if matches existing tag name -> add existing instead
    const match = tags.find((t) => keyOf(t.name) === keyOf(name))
    if (match) {
      addExisting(match)
      return
    }

    if (existsInSelected(name)) {
      setInput("")
      setOpen(false)
      return
    }

    setData("new_tags", [...newTags, name])
    setInput("")
    setOpen(false)
  }

  const removeExisting = (id: number) => {
    setData("tags", selectedIds.filter((x) => x !== id))
  }

  const removeNew = (name: string) => {
    const k = keyOf(name)
    setData("new_tags", newTags.filter((t) => keyOf(t) !== k))
  }

  // Enter / comma creates new tag (if not suggestion click)
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addNew(input)
    }
    if (e.key === "Escape") setOpen(false)
  }

  useEffect(() => {
    setOpen(!!keyOf(input))
  }, [input])

  return (
    <div className="space-y-2">
      <Label>Tags</Label>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2">
        {selectedExisting.map((t) => (
          <span key={t.id} className="rounded bg-gray-200 px-2 py-1 text-sm flex items-center gap-2">
            {t.name}
            <button type="button" className="text-xs" onClick={() => removeExisting(t.id)}>
              ✕
            </button>
          </span>
        ))}

        {newTags.map((t) => (
          <span key={t} className="rounded bg-blue-100 px-2 py-1 text-sm flex items-center gap-2">
            {t}
            <span className="text-[10px] text-blue-700">(new)</span>
            <button type="button" className="text-xs" onClick={() => removeNew(t)}>
              ✕
            </button>
          </span>
        ))}
      </div>

      <Input
        placeholder="Type tag, press Enter to add"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onFocus={() => setOpen(!!keyOf(input))}
      />

      {/* Suggestions */}
      {open && suggestions.length > 0 && (
        <div className="border rounded p-2 max-h-48 overflow-y-auto bg-white">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left p-1 rounded hover:bg-gray-100 flex items-center justify-between"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => addExisting(s)}
            >
              <span>{s.name}</span>
              <span className="text-xs text-gray-500">Add</span>
            </button>
          ))}
        </div>
      )}

      {/* Quick create hint */}
      {keyOf(input) && suggestions.length === 0 && (
        <div className="text-xs text-gray-600 flex items-center justify-between">
          <span>
            Press <b>Enter</b> to create: <b>{normalizeName(input)}</b>
          </span>
          <Button type="button" size="sm" variant="outline" onMouseDown={(e) => e.preventDefault()} onClick={() => addNew(input)}>
            Create
          </Button>
        </div>
      )}

      {errors?.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
      {errors?.new_tags && <p className="text-red-500 text-sm">{errors.new_tags}</p>}
    </div>
  )
}
