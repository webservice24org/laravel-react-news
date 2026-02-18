declare function route(name: string, params?: any): string
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import toast from "react-hot-toast"

export function BulkDeleteUnion({ ids, onSuccess }: { ids: number[]; onSuccess: () => void }) {
  const handleBulkDelete = () => {
    router.post(route("admin.unions.bulk-delete"), { ids }, {
      onSuccess: () => {
        toast.success(`${ids.length} unions deleted successfully`)
        onSuccess()
      },
      onError: () => toast.error("Failed to delete selected unions"),
    })
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
          <DialogTitle>Delete Selected Unions</DialogTitle>
        </DialogHeader>

        <p>Are you sure you want to delete {ids.length} selected unions?</p>

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
