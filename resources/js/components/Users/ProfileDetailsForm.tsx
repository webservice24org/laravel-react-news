declare function route(name: string, params?: any): string

import { useForm, usePage } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"

import { useEffect, useState } from "react"



// -------------------------
// TypeScript Interfaces
// -------------------------
interface UserProfile {
  profile_photo?: string | null
  address?: string
  about?: string
  dob?: string
  nid_number?: string
  mobile_number?: string
}

interface User {
  id: number
  name: string
  email: string
  profile?: UserProfile | null
}

interface SharedData {
  [key: string]: any // 🔹 required by Inertia
  auth: {
    user: User
  }
}

// -------------------------
// Component
// -------------------------
export default function ProfileDetailsForm() {

  const { auth } = usePage<SharedData>().props
  const user = auth.user
  const profile = user.profile || null

  const [preview, setPreview] = useState<string | null>(
    profile?.profile_photo ? `/storage/${profile.profile_photo}` : null
  )
  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "";
    return isoString.split("T")[0]; // takes only YYYY-MM-DD
  };



  const { data, setData, post, processing, errors } = useForm({
    profile_photo: null as File | null,
    address: profile?.address || "",
    about: profile?.about || "",
    dob: formatDate(profile?.dob),
    nid_number: profile?.nid_number || "",
    mobile_number: profile?.mobile_number || "",
    })


  // Update form whenever profile changes
  useEffect(() => {
    setData({
        profile_photo: null,
        address: profile?.address || "",
        about: profile?.about || "",
        dob: formatDate(profile?.dob),
        nid_number: profile?.nid_number || "",
        mobile_number: profile?.mobile_number || "",
    })

    setPreview(profile?.profile_photo ? `/storage/${profile.profile_photo}` : null)
    }, [profile])


  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    post(route("profile.details.update"), {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("Profile details updated")
      },
      onError: () => toast.error("Update failed"),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      {/* Profile Photo */}
      <div className="space-y-2">
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            className="h-24 w-24 rounded-full object-cover border"
          />
        )}

        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null
            setData("profile_photo", file)

            if (file) {
              setPreview(URL.createObjectURL(file))
            }
          }}
        />

        {errors.profile_photo && (
          <p className="text-red-500 text-sm">{errors.profile_photo}</p>
        )}
      </div>

      {/* Address */}
      <Input
        placeholder="Address"
        value={data.address}
        onChange={(e) => setData("address", e.target.value)}
      />

      {/* About */}
      <Textarea
        placeholder="About"
        value={data.about}
        onChange={(e) => setData("about", e.target.value)}
      />

      {/* Date of Birth */}
      <Input
        type="date"
        value={data.dob}
        onChange={(e) => setData("dob", e.target.value)}
      />

      {/* NID Number */}
      <Input
        placeholder="NID Number"
        value={data.nid_number}
        onChange={(e) => setData("nid_number", e.target.value)}
      />

      {/* Mobile Number */}
      <Input
        placeholder="Mobile Number"
        value={data.mobile_number}
        onChange={(e) => setData("mobile_number", e.target.value)}
      />

      <Button disabled={processing}>
        {processing ? "Saving..." : "Save Details"}
      </Button>
    </form>
  )
}
