"use client"

import React, { useMemo, useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal, Pencil } from "lucide-react"
import DeleteNewsButton from "@/components/Admin/News/DeleteNewsButton"
import BulkDeleteNewsButton from "@/components/Admin/News/BulkDeleteNewsButton"

declare function route(name: string, params?: any): string

type Id = number
type Category = { id: Id; name: string }
type Tag = { id: Id; name: string }
type Author = { id: Id; name: string }

type NewsPostRow = {
  id: Id
  news_title: string
  is_lead: boolean
  is_sub_lead: boolean
  view_count: number
  status: "draft" | "published" | "scheduled"
  categories?: Category[]
  tags?: Tag[]
  author?: Author | null
  created_at?: string
}

type PaginatorLink = {
  url: string | null
  label: string
  active: boolean
}

type Paginator<T> = {
  data: T[]
  current_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  links: PaginatorLink[]
}

export default function Index({ newsPosts }: { newsPosts: Paginator<NewsPostRow> }) {
  const [q, setQ] = useState("")
  const [selected, setSelected] = useState<number[]>([])

  const rows = useMemo(() => {
    const value = q.trim().toLowerCase()
    if (!value) return newsPosts.data

    return newsPosts.data.filter((n) => {
      const title = (n.news_title || "").toLowerCase()
      const status = (n.status || "").toLowerCase()
      const author = (n.author?.name || "").toLowerCase()
      const cats = (n.categories || []).map((c) => c.name.toLowerCase()).join(" ")
      const tags = (n.tags || []).map((t) => t.name.toLowerCase()).join(" ")
      return (
        title.includes(value) ||
        status.includes(value) ||
        author.includes(value) ||
        cats.includes(value) ||
        tags.includes(value)
      )
    })
  }, [q, newsPosts.data])

  const slBase = (newsPosts.from ?? 1) - 1

  const go = (url: string | null) => {
    if (!url) return
    router.visit(url, { preserveScroll: true, preserveState: true })
  }

  const statusBadge = (status: NewsPostRow["status"]) => {
    if (status === "published") return <Badge className="bg-green-600">Published</Badge>
    if (status === "scheduled") return <Badge className="bg-amber-600">Scheduled</Badge>
    return <Badge variant="secondary">Draft</Badge>
  }

  const toggleOne = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleAllOnPage = () => {
    const ids = rows.map((r) => r.id)
    const allSelected = ids.length > 0 && ids.every((id) => selected.includes(id))

    setSelected((prev) => {
      if (allSelected) return prev.filter((id) => !ids.includes(id))
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return Array.from(next)
    })
  }

  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id))

  return (
    <AppLayout>
      <Head title="News Posts" />

      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">News Posts</h1>
            <div className="text-sm text-neutral-500">
              Showing {newsPosts.from ?? 0}–{newsPosts.to ?? 0} of {newsPosts.total}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, author, category, tag..."
              className="w-full md:w-[320px]"
            />

            {/* ✅ Bulk delete component */}
            <BulkDeleteNewsButton
              ids={selected}
              onDeleted={() => setSelected([])}
            />

            <Link href={route("admin.news-posts.create")}>
              <Button type="button">Add New</Button>
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border bg-white dark:bg-gray-900 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 border-r text-center">
                  <input type="checkbox" checked={allChecked} onChange={toggleAllOnPage} />
                </TableHead>

                <TableHead className="w-15 border-r">SL</TableHead>
                <TableHead className="border-r">News Title</TableHead>
                <TableHead className="w-22.5 text-center border-r">Lead</TableHead>
                <TableHead className="w-27.5 text-center border-r">Sub Lead</TableHead>
                <TableHead className="w-30 text-center border-r">Views</TableHead>
                <TableHead className="w-32.5 border-r text-center">Status</TableHead>
                <TableHead className="w-22.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-neutral-500">
                    No news posts found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((n, idx) => (
                  <TableRow key={n.id}>
                    <TableCell className="border-r text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(n.id)}
                        onChange={() => toggleOne(n.id)}
                      />
                    </TableCell>

                    <TableCell className="text-neutral-600 border-r">{slBase + idx + 1}</TableCell>

                    <TableCell className="border-r">
                      <div className="space-y-1">
                        <div className="font-medium text-neutral-900 dark:text-white">{n.news_title}</div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          {n.author?.name ? <span>By: {n.author.name}</span> : null}

                          {(n.categories?.length ?? 0) > 0 ? (
                            <span>
                              • Categories: {n.categories!.slice(0, 2).map((c) => c.name).join(", ")}
                              {(n.categories!.length ?? 0) > 2 ? "…" : ""}
                            </span>
                          ) : null}

                          {(n.tags?.length ?? 0) > 0 ? (
                            <span>
                              • Tags: {n.tags!.slice(0, 2).map((t) => t.name).join(", ")}
                              {(n.tags!.length ?? 0) > 2 ? "…" : ""}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center border-r">
                      {n.is_lead ? <Badge className="bg-blue-600">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                    </TableCell>

                    <TableCell className="text-center border-r">
                      {n.is_sub_lead ? <Badge className="bg-indigo-600">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                    </TableCell>

                    <TableCell className="text-center border-r">{n.view_count ?? 0}</TableCell>

                    <TableCell className="border-r text-center">{statusBadge(n.status)}</TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem asChild>
                            <Link href={route("admin.news-posts.edit", n.id)} className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                          >
                            <DeleteNewsButton id={n.id} title={n.news_title} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-neutral-500">
            Page {newsPosts.current_page} • {newsPosts.per_page} per page • Total {newsPosts.total}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {newsPosts.links.map((l, i) => (
              <Button
                key={i}
                type="button"
                variant={l.active ? "default" : "outline"}
                size="sm"
                disabled={!l.url}
                onClick={() => go(l.url)}
              >
                <span dangerouslySetInnerHTML={{ __html: l.label }} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
