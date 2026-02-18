declare function route(name: string, params?: any): string;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";

interface CreateDistrictProps {
  divisions: { id: number; name: string }[];
}

export default function CreateDistrict({ divisions }: CreateDistrictProps) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    slug: "",
    division_id: "",
    status: true,
    order_no: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("admin.districts.store"), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("District created successfully");
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create District</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create District</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
            {/* Division */}
          <div className="space-y-2">
            <label className="block font-medium">Division</label>
            <Select
              value={data.division_id}
              onValueChange={(value) => setData("division_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((div) => (
                  <SelectItem key={div.id} value={String(div.id)}>
                    {div.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.division_id && (
              <p className="text-red-500 text-sm">{errors.division_id}</p>
            )}
          </div>

          {/* District Name */}
          <div className="space-y-2">
            <label className="block font-medium">District Name</label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="District Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

            {/* Slug */}
          <div className="space-y-2">
            <label className="block font-medium">Slug</label>
            <Input
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
              placeholder="Slug"
            />
            {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
          </div>
          

          {/* Order No */}
          <div className="space-y-2">
            <label className="block font-medium">Order No</label>
            <Input
              type="number"
              value={data.order_no}
              onChange={(e) => setData("order_no", e.target.value)}
              placeholder="Order No"
            />
            {errors.order_no && (
              <p className="text-red-500 text-sm">{errors.order_no}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
