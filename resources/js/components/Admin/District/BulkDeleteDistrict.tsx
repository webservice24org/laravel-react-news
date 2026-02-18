declare function route(name: string, params?: any): string;
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

interface BulkDeleteDistrictProps {
  ids: number[];
  onSuccess: () => void;
}

export function BulkDeleteDistrict({ ids, onSuccess }: BulkDeleteDistrictProps) {
  const handleBulkDelete = () => {
    router.post(
      route("admin.districts.bulk-delete"), // route name
      { ids }, // data
      {
        onSuccess: () => {
          toast.success(`${ids.length} districts deleted successfully`);
          onSuccess();
        },
        onError: () => {
          toast.error("Failed to delete selected districts");
        },
      }
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete {ids.length} Selected
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Selected Districts</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <strong>{ids.length}</strong> selected districts?
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
  );
}
