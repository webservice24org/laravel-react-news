import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

declare function route(name: string, params?: any): string;

interface DeleteCategoryProps {
    category: any;
}

export function DeleteCategory({ category }: DeleteCategoryProps) {
    const [open, setOpen] = useState(false);

    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        destroy(route("admin.categories.destroy", category.id), {
            onSuccess: () => {
                toast.success("Category deleted successfully!");
                setOpen(false);
            },
            onError: () => toast.error("Delete failed!"),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                    Delete
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>

                <p>Are you sure you want to delete <strong>{category.name}</strong>?</p>

                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                        {processing ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
