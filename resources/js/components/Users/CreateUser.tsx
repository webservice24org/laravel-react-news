declare function route(
  name: string,
  params?: any
): string
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "@inertiajs/react"
import { useState } from "react"
import toast from "react-hot-toast" // ✅ import toast
import { Eye, EyeOff } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "../ui/checkbox"


export function CreateUser({ roles }: any) {
  const [open, setOpen] = useState(false) // ✅ control dialog open/close
  const [showPassword, setShowPassword] = useState(false)


  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    password: "",
    role: "",
    is_active: true,
  })

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    post(route("admin.users.store"), {
      onSuccess: () => {
        reset()            // clear form
        toast.success("User created successfully!") // show toast
        setOpen(false)     // close dialog
      },
      onError: () => {
        toast.error("Failed to create user. Check the form and try again.")
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Create User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Name"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}

        <Input
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData("email", e.target.value)}
        />
        {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}

        <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData("password", e.target.value)}
          className="pr-10"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

        {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}

        {/* Role */}
        <div className="space-y-1">
          

          <Select
            value={data.role}
            onValueChange={(value) => setData("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>

            <SelectContent>
              {roles.map((role: any) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={data.is_active}
            onCheckedChange={(checked) => setData("is_active", !!checked)}
          />
          <span>Active</span>
        </div>

        {errors.role && <div className="text-red-500 text-sm">{errors.role}</div>}

        <Button onClick={submit} disabled={processing}>
          {processing ? "Saving..." : "Save"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
