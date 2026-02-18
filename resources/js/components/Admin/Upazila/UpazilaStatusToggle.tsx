declare function route(name: string, params?: any): string
import { useState } from "react"
import { router } from "@inertiajs/react"
import { Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"

interface UpazilaStatusToggleProps {
  upazila: {
    id: number
    status: boolean
  }
}

export default function UpazilaStatusToggle({ upazila }: UpazilaStatusToggleProps) {
  const [checked, setChecked] = useState(upazila.status)
  const [loading, setLoading] = useState(false)

  const toggleStatus = () => {
    setLoading(true)

    router.patch(
      route("admin.upazilas.toggle-status", { upazila: upazila.id }),
      { status: !checked }, // ✅ send status
      {
        preserveScroll: true,
        onSuccess: () => {
          setChecked(!checked)
          toast.success(`Upazila ${!checked ? "activated" : "deactivated"}`)
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
