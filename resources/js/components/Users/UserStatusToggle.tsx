declare function route(
  name: string,
  params?: any
): string
import { Switch } from "@/components/ui/switch"
import { router } from "@inertiajs/react"
import toast from "react-hot-toast"

interface Props {
  user: any
}

export function UserStatusToggle({ user }: Props) {
  const toggle = () => {
    router.patch(
      route("admin.users.toggle-status", user.id),
      {},
      {
        preserveScroll: true,
        onSuccess: () => toast.success("User status updated"),
        onError: () => toast.error("Failed to update status"),
      }
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={user.is_active}
        onCheckedChange={toggle}
      />
      <span
        className={`text-xs font-medium ${
            user.is_active
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
        >
        {user.is_active ? "Active" : "Inactive"}
     </span>

    </div>
  )
}
