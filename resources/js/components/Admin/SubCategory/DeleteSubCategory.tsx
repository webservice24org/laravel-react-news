declare function route(
  name: string,
  params?: any
): string
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

interface DeleteSubCategoryProps {
  subCategory: {
    id: number;
    name: string;
  };
  onDeleted?: () => void;
}

export function DeleteSubCategory({ subCategory, onDeleted }: DeleteSubCategoryProps) {
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleDelete = () => {
    setProcessing(true);

    router.delete(route("admin.subcategories.destroy", subCategory.id), {
      onSuccess: () => {
        setOpen(false);
        setProcessing(false);
        toast.success(`Sub Category "${subCategory.name}" deleted`);
        onDeleted?.();
      },
      onError: () => {
        setProcessing(false);
        toast.error("Delete failed");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button variant="destructive" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sub Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{subCategory.name}</strong>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white"
            onClick={handleDelete}
            disabled={processing}
          >
            {processing ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
