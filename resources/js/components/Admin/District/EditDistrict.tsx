declare function route(name: string, params?: any): string;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
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

interface EditDistrictProps {
  district: {
    id: number;
    name: string;
    slug: string;
    division_id: number;
    order_no: number;
    status: boolean;
  };
  divisions: { id: number; name: string }[];
}

export function EditDistrict({ district, divisions }: EditDistrictProps) {
  const [open, setOpen] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: district.name,
    slug: district.slug,
    division_id: String(district.division_id),
    status: Boolean(district.status),
    order_no: String(district.order_no),
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route("admin.districts.update", district.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("District updated successfully");
        reset();
        setOpen(false);
      },
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
          <DialogTitle>Edit District</DialogTitle>
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

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Status ({data.status ? "Active" : "Inactive"})
            </span>
            <Switch
              checked={data.status}
              onCheckedChange={(val) => setData("status", val)}
            />
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
              Update
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
