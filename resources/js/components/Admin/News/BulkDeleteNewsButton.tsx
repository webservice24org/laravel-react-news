"use client"

import React, { useMemo, useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

declare function route(name: string, params?: any): string

export default function BulkDeleteNewsButton({
  ids,
  disabled,
  onDeleted,
}: {
  ids: number[]
  disabled?: boolean
  onDeleted?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  const count = ids.length

  const title = useMemo(() => {
    if (count === 0) return "Delete Selected"
    if (count === 1) return "Delete Selected (1)"
    return `Delete Selected (${count})`
  }, [count])

  const doDelete = () => {
    if (count === 0 || processing) return
    setProcessing(true)

    // ✅ backend expects POST
    router.post(
      route("admin.news-posts.bulk-destroy"),
      { ids },
      {
        preserveScroll: true,
        onSuccess: () => {
          setOpen(false)
          onDeleted?.()
        },
        onFinish: () => setProcessing(false),
      }
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" disabled={disabled || count === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete selected posts?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to permanently delete{" "}
            <span className="font-semibold">{count}</span> news post(s).
            <br />
            This will also remove their thumbnails and related pivot records.
            <br />
            <strong>This action cannot be undone.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={processing}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            className="bg-red-600 hover:bg-red-700"
            disabled={processing}
            onClick={(e) => {
              e.preventDefault()
              doDelete()
            }}
          >
            {processing ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
