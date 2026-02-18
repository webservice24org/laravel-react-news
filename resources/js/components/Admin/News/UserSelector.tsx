"use client"

import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, ChevronDown, Search } from "lucide-react"

type User = { id: number; name: string; email?: string }

export default function UserSelect({
  data,
  setData,
  users = [],
  errors = {},
}: {
  data: any
  setData: (key: string, value: any) => void
  users: User[]
  errors?: any
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")

  const selectedId = data.user_id ? Number(data.user_id) : null
  const selectedUser = users.find((u) => u.id === selectedId) || null

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) => {
      return (
        u.name.toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        String(u.id).includes(term)
      )
    })
  }, [q, users])

  const pick = (id: number) => {
    setData("user_id", id)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <Label>Post As (Author)</Label>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="secondary" className="w-full justify-between">
            <span className="truncate">
              {selectedUser ? `${selectedUser.name}${selectedUser.email ? ` (${selectedUser.email})` : ""}` : "Select a user"}
            </span>
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-105 p-2" align="start">
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name/email/id..."
              className="pl-9"
            />
          </div>

          <div className="max-h-70 overflow-auto rounded border">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-neutral-500">No users found.</div>
            ) : (
              filtered.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-neutral-100 flex items-center justify-between"
                  onClick={() => pick(u.id)}
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{u.name}</div>
                    {u.email && <div className="text-xs text-neutral-500 truncate">{u.email}</div>}
                  </div>
                  {selectedId === u.id && <Check size={16} className="text-emerald-600" />}
                </button>
              ))
            )}
          </div>

          {selectedId && (
            <Button
              type="button"
              variant="ghost"
              className="mt-2 w-full"
              onClick={() => setData("user_id", "")}
            >
              Clear selection
            </Button>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {errors?.user_id && <p className="text-red-600 text-sm">{errors.user_id}</p>}
    </div>
  )
}
