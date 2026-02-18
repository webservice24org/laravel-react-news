declare function route(name: string, params?: any): string

import { router } from "@inertiajs/react"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

export default function CategoryStatusToggle({ category }: { category: any }) {
  const toggle = () => {
    router.patch(
      route("admin.categories.toggle-status", category.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success("Status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    )
  }

  

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={category.status}
        onCheckedChange={toggle}
      />
      <span
        className={`text-xs font-medium ${
            category.status
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
        >
        {category.status ? "Active" : "Inactive"}
     </span>

    </div>
  )
}
