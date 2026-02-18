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

interface DeleteDistrictProps {
  district: { id: number; name: string };
  onDeleted?: () => void;
}

export function DeleteDistrict({ district, onDeleted }: DeleteDistrictProps) {
  const handleDelete = () => {
    router.delete(route("admin.districts.destroy", district.id), {
      onSuccess: () => {
        toast.success("District deleted successfully");
        if (onDeleted) onDeleted();
      },
      onError: () => {
        toast.error("Failed to delete district");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete District</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <strong>{district.name}</strong>?
        </p>

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
  );
}
