import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

declare function route(name: string, params?: any): string;

export default function CreateCategory() {
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        slug: "",
        status: true,
        order_no: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("admin.categories.store"), {
            onSuccess: () => {
                toast.success("Category created successfully!");
                setOpen(false);
                reset(); // clear form
            },
            onError: () => toast.error("Failed to create category."),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 mt-2">
                    <div className="grid gap-2">
                        <Input
                            placeholder="Name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Input
                            placeholder="Slug (optional)"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                        />
                        {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
                    </div>

                    <div className="grid gap-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.status}
                                onChange={(e) => setData("status", e.target.checked)}
                            />
                            Active
                        </label>
                        {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Input
                            type="number"
                            placeholder="Order No"
                            value={data.order_no}
                            onChange={(e) => setData("order_no", e.target.value)}
                        />
                        {errors.order_no && <p className="text-red-500 text-sm">{errors.order_no}</p>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? "Saving..." : "Save Category"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
