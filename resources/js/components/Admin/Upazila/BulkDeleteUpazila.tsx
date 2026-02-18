declare function route(name: string, params?: any): string
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

interface BulkDeleteUpazilaProps {
  ids: number[]
  onSuccess: () => void
}

export function BulkDeleteUpazila({ ids, onSuccess }: BulkDeleteUpazilaProps) {
  const handleBulkDelete = () => {
    router.post(
      route("admin.upazilas.bulk-delete"),
      { ids },
      {
        onSuccess: () => {
          onSuccess()
        },
      }
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete {ids.length} Selected
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Selected Upazilas</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <strong>{ids.length}</strong>{" "}
          selected upazilas? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleBulkDelete}>
            Delete All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
