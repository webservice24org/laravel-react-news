declare function route(name: string, params?: any): string
import { useState } from "react"
import { router } from "@inertiajs/react"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

interface UnionStatusToggleProps {
  union: {
    id: number
    status: boolean
  }
}

export default function UnionStatusToggle({ union }: UnionStatusToggleProps) {
  const [checked, setChecked] = useState(union.status)
  const [loading, setLoading] = useState(false)

  const toggleStatus = () => {
    setLoading(true)
    router.patch(
      route("admin.unions.toggle-status", { union: union.id }),
      { status: !checked },
      {
        preserveScroll: true,
        onSuccess: () => {
          setChecked(!checked)
          toast.success(`Union ${!checked ? "activated" : "deactivated"}`)
          setLoading(false)
        },
        onError: () => {
          toast.error("Failed to update status")
          setLoading(false)
        },
      }
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={toggleStatus}
        disabled={loading}
      />
      <span
        className={`text-xs font-medium ${
          checked
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {checked ? "Active" : "Inactive"}
      </span>
    </div>
  )
}
