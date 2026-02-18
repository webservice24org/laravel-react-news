import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import toast from "react-hot-toast"

export function DeleteUnion({ union, onDeleted }: { union: any; onDeleted?: () => void }) {
  const handleDelete = () => {
    router.delete(`/admin/unions/${union.id}`, {
      onSuccess: () => {
        toast.success(`Union ${union.name} deleted successfully`)
        if (onDeleted) onDeleted()
      },
      onError: () => toast.error("Failed to delete union"),
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Union</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete <strong>{union.name}</strong>?</p>

        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
