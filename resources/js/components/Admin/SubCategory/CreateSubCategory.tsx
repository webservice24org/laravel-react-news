import { useForm } from "@inertiajs/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"

declare function route(name: string): string

export default function CreateSubCategory({ categories }: { categories: any[] }) {
  const [open, setOpen] = useState(false)

  const { data, setData, post, processing, reset, errors } = useForm({
    category_id: "",
    name: "",
    status: true,
    order_no: "",
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route("admin.subcategories.store"), {
      onSuccess: () => {
        toast.success("Sub Category created")
        reset()
        setOpen(false)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Sub Category</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Sub Category</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          {/* Category */}
          <Select
            onValueChange={(value) => setData("category_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-sm text-red-500">{errors.category_id}</p>
          )}

          {/* Name */}
          <Input
            placeholder="Sub category name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
          />

          {/* Order */}
          <Input
            type="number"
            placeholder="Order"
            value={data.order_no}
            onChange={(e) => setData("order_no", e.target.value)}
          />

          <Button disabled={processing}>
            {processing ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
