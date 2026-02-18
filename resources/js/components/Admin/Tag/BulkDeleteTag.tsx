import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

declare function route(name: string, params?: any): string

export function BulkDeleteTag({
  ids,
  onSuccess,
}: {
  ids: number[]
  onSuccess?: () => void
}) {
  if (!ids.length) return null

  const destroy = () => {
    router.post(
    route("admin.tags.bulk-delete"),
    { ids },
        {
            preserveScroll: true,
            onSuccess: () => {
            toast.success("Selected tags deleted successfully")
            onSuccess?.()
            },
        }
    )

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete Selected ({ids.length})
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Selected Tags</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{ids.length}</span> selected tags?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={destroy}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
