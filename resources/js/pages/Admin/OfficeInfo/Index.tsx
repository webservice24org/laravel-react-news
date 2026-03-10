declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import toast from "react-hot-toast"
import { FormEvent } from "react"
import { BreadcrumbItem } from "@/types"

interface OfficeInfo {
  office_address?: string
  mobile?: string
  phone?: string
  email?: string
  editor_title?: string
  editor_name?: string
}

interface PageProps {
  office: OfficeInfo | null
}

export default function Index({ office }: PageProps) {

  const { data, setData, post, processing } = useForm({
    office_address: office?.office_address || "",
    mobile: office?.mobile || "",
    phone: office?.phone || "",
    email: office?.email || "",
    editor_title: office?.editor_title || "",
    editor_name: office?.editor_name || "",
  })

  const submit = (e: FormEvent) => {
    e.preventDefault()

    post(route("admin.office-info.store"), {
      onSuccess: () => {
        toast.success("Office information saved successfully")
      }
    })
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Office Information", href: "/admin/office-info" }
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>

      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Office Information</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">Office Address</label>
                <Textarea
                  value={data.office_address}
                  onChange={(e)=>setData("office_address",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile</label>
                <Input
                  value={data.mobile}
                  onChange={(e)=>setData("mobile",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={data.phone}
                  onChange={(e)=>setData("phone",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e)=>setData("email",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Editor Title</label>
                <Input
                  value={data.editor_title}
                  onChange={(e)=>setData("editor_title",e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Editor Name</label>
                <Input
                  value={data.editor_name}
                  onChange={(e)=>setData("editor_name",e.target.value)}
                />
              </div>

              <Button disabled={processing}>
                Save Information
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}