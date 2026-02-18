declare function route(
  name: string,
  params?: any
): string
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  status: boolean;
  order_no?: number;
}

interface EditSubCategoryProps {
  subCategory: SubCategory;
  categories: Category[];
}

export function EditSubCategory({ subCategory, categories }: EditSubCategoryProps) {
  const [open, setOpen] = useState(false);

  // When initializing the form
const { data, setData, put, processing, errors } = useForm({
  category_id: String(subCategory.category_id), // ✅ convert to string
  name: subCategory.name,
  slug: subCategory.slug,
  status: subCategory.status,
  order_no: String(subCategory.order_no || 0), // keep string
});


   const submit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route("admin.subcategories.update", subCategory.id), {
      onSuccess: () => {
        toast.success("Sub Category updated");
        setOpen(false);
      },
      onError: () => toast.error("Update failed"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Sub Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">

          {/* Category dropdown */}
            <Select
            value={data.category_id} // string
            onValueChange={(val) => setData("category_id", val)}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}> {/* string */}
                    {cat.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>

          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id}</p>}

          {/* Name */}
          <Input
            placeholder="Sub Category Name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* Slug */}
          <Input
            placeholder="Slug"
            value={data.slug}
            onChange={(e) => setData("slug", e.target.value)}
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

          {/* Active/Inactive Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.status}
              onChange={(e) => setData("status", e.target.checked)}
              className="h-4 w-4"
            />
            Active
          </label>

          {/* Order No */}
          <Input
            type="number"
            placeholder="Order No"
            value={data.order_no}
            onChange={(e) => setData("order_no", e.target.value)}
          />

          <DialogFooter>
            <Button type="submit" disabled={processing}>
              {processing ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
