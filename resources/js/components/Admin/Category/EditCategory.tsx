import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

declare function route(name: string, params?: any): string;

interface EditCategoryProps {
    category: any;
}

export function EditCategory({ category }: EditCategoryProps) {
    const [open, setOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: category.name,
        slug: category.slug || "",
        status: category.status,
        order_no: category.order_no || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("admin.categories.update", category.id), {
            onSuccess: () => {
                toast.success("Category updated successfully!");
                setOpen(false);
            },
            onError: () => toast.error("Update failed."),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    Edit
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 mt-2">
                    <Input
                        placeholder="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    <Input
                        placeholder="Slug (optional)"
                        value={data.slug}
                        onChange={(e) => setData("slug", e.target.value)}
                    />
                    {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={data.status}
                            onChange={(e) => setData("status", e.target.checked)}
                        />
                        Active
                    </label>
                    {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}

                    <Input
                        type="number"
                        placeholder="Order No"
                        value={data.order_no}
                        onChange={(e) => setData("order_no", e.target.value)}
                    />
                    {errors.order_no && <p className="text-red-500 text-sm">{errors.order_no}</p>}

                    <Button type="submit" disabled={processing}>
                        {processing ? "Updating..." : "Update Category"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
