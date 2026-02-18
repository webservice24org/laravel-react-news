"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Search } from "lucide-react"

type Category = { id: number; name: string }
type SubCategory = { id: number; name: string; category_id: number }

export default function CategoryTreeWp({
  data,
  setData,
  categories = [],
  subcategories = [],
  errors = {},
}: {
  data: any
  setData: (key: string, value: any) => void
  categories: Category[]
  subcategories: SubCategory[]
  errors?: any
}) {
  const [q, setQ] = useState("")
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})
  const [selectedCategories, setSelectedCategories] = useState<number[]>(data.categories || [])
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(data.subcategories || [])

  // Keep form state in sync
  useEffect(() => {
    setData("categories", selectedCategories)
    setData("subcategories", selectedSubcategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedSubcategories])

  // Group subs by parent
  const subsByCat = useMemo(() => {
    const map = new Map<number, SubCategory[]>()
    for (const s of subcategories) {
      if (!map.has(s.category_id)) map.set(s.category_id, [])
      map.get(s.category_id)!.push(s)
    }
    // sort for stable UI
    for (const [k, arr] of map.entries()) {
      map.set(
        k,
        [...arr].sort((a, b) => a.name.localeCompare(b.name))
      )
    }
    return map
  }, [subcategories])

  const filteredCategories = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return categories

    return categories.filter((c) => {
      const catMatch = c.name.toLowerCase().includes(term)
      const subs = subsByCat.get(c.id) || []
      const subMatch = subs.some((s) => s.name.toLowerCase().includes(term))
      return catMatch || subMatch
    })
  }, [q, categories, subsByCat])

  const toggleExpand = (catId: number) => {
    setExpanded((p) => ({ ...p, [catId]: !p[catId] }))
  }

  const toggleCategory = (catId: number, checked: boolean) => {
    setSelectedCategories((prev) => {
      const next = checked ? [...new Set([...prev, catId])] : prev.filter((id) => id !== catId)
      return next
    })

    // if unchecking category -> remove its subcategories
    if (!checked) {
      const childIds = (subsByCat.get(catId) || []).map((s) => s.id)
      setSelectedSubcategories((prev) => prev.filter((id) => !childIds.includes(id)))
    }

    // WP-like: auto-expand when selecting
    if (checked) setExpanded((p) => ({ ...p, [catId]: true }))
  }

  const toggleSubcategory = (subId: number, checked: boolean) => {
    setSelectedSubcategories((prev) => {
      const next = checked ? [...new Set([...prev, subId])] : prev.filter((id) => id !== subId)
      return next
    })
  }

  return (
    <div className="space-y-2">
      <Label>Categories / Subcategories *</Label>

      {/* WP-like search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search categories..."
          className="pl-9"
        />
      </div>

      {/* Tree box like WP */}
      <div className="rounded border bg-white p-3 max-h-90 overflow-auto dark:bg-gray-900">
        <div className="space-y-2">
          {filteredCategories.map((cat) => {
            const subs = subsByCat.get(cat.id) || []
            const hasSubs = subs.length > 0
            const isExpanded = !!expanded[cat.id]
            const isCatChecked = selectedCategories.includes(cat.id)

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  {/* expand icon */}
                  <button
                    type="button"
                    className={[
                      "h-7 w-7 inline-flex items-center justify-center rounded hover:bg-neutral-100 hover:text-red-600 dark:bg-black/10",
                      !hasSubs ? "opacity-30 pointer-events-none" : "",
                    ].join(" ")}
                    onClick={() => toggleExpand(cat.id)}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>

                  <Checkbox
                    checked={isCatChecked}
                    onCheckedChange={(v) => toggleCategory(cat.id, Boolean(v))}
                  />
                  <span className="font-medium text-neutral-900 dark:text-white">{cat.name}</span>
                </div>

                {/* children */}
                {hasSubs && isExpanded && (
                  <div className="ml-9 space-y-1 border-l pl-3">
                    {subs.map((sub) => {
                      const isSubChecked = selectedSubcategories.includes(sub.id)
                      return (
                        <label key={sub.id} className="flex items-center gap-2 py-0.5">
                          <Checkbox
                            checked={isSubChecked}
                            disabled={!isCatChecked}
                            onCheckedChange={(v) => toggleSubcategory(sub.id, Boolean(v))}
                          />
                          <span className={isCatChecked ? "text-neutral-800 dark:text-white" : "text-neutral-900 dark:text-gray-400"}>
                            {sub.name}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {errors?.categories && <p className="text-red-600 text-sm">{errors.categories}</p>}
      {errors?.subcategories && <p className="text-red-600 text-sm">{errors.subcategories}</p>}
    </div>
  )
}
