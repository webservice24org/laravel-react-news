declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { FormEvent, useState } from "react"
import { BreadcrumbItem } from "@/types"
import { Checkbox } from "@/components/ui/checkbox"

interface AssignProps {
  categories: { id: number; name: string }[]
  subCategories: { id: number; name: string; category_id: number }[]
}

const adPositions = [
'Home Right Sidebar One',
'Single Page Below Article',
'Single Page Sidebar One',
'Category Sidebar One',
'Category Sidebar Two',
'Category Below Grid',
'Sub Category Sidebar One',
'Sub Category Sidebar Two',
'Sub Category Below Grid',
'Category Home Section Footer',
'Category Global Sidebar One',
'Category Global Sidebar Two',
'Category Global Below Grid',
'Sub Category Global Sidebar One',
'Sub Category Global Sidebar Two',
'Sub Category Global Below Grid',
'Global Header Bottom',
'Global Before Footer',
'Global Below Grid',
'Global Sidebar One',
'Global Sidebar Two'
]

export default function Assign({ categories, subCategories }: AssignProps) {

  const [preview,setPreview] = useState<string | null>(null)

  const { data,setData,post,processing } = useForm({
    ad_name: "",
    ad_url: "",
    ad_image: null as File | null,
    ad_code: "",
    is_global:false,
    status:true,
    categories: [] as number[],
    sub_categories: [] as number[],
  })

  const handleImage = (e:any)=>{
    const file = e.target.files[0]
    setData("ad_image",file)

    if(file){
      setPreview(URL.createObjectURL(file))
    }
  }

  const submit = (e:FormEvent)=>{
    e.preventDefault()

    post(route("admin.advertisements.store"), {
        forceFormData: true,
        onSuccess: () => toast.success("Advertisement created successfully")
    })
  }

  const breadcrumbs:BreadcrumbItem[] = [
    {title:"Advertisements",href:"/admin/ads"}
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl p-10">

        <Card>
          <CardHeader>
            <CardTitle>Create Advertisement</CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={submit} className="space-y-6">

              {/* Ad Position */}
              <div>
                <label className="text-sm font-medium">Ad Position</label>

                <select
                className="w-full border rounded-md p-2 mt-2"
                value={data.ad_name}
                onChange={(e)=>setData("ad_name",e.target.value)}
                >
                  <option value="">Select Position</option>

                  {adPositions.map((ad)=>(
                    <option key={ad} value={ad}>{ad}</option>
                  ))}

                </select>
              </div>


              {/* URL */}
              <div>
                <label className="text-sm font-medium">Ad URL</label>
                <Input
                value={data.ad_url}
                onChange={(e)=>setData("ad_url",e.target.value)}
                />
              </div>


              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium">Ad Image</label>

                <Input
                type="file"
                onChange={handleImage}
                />

                {preview && (
                  <img
                  src={preview}
                  className="mt-3 w-64 rounded border"
                  />
                )}
              </div>


              {/* Ad Code */}
              <div>
                <label className="text-sm font-medium">Ad Code</label>
                <Textarea
                value={data.ad_code}
                onChange={(e)=>setData("ad_code",e.target.value)}
                rows={4}
                />
              </div>


              {/* Switches */}
              <div className="flex gap-10">

                <div className="flex items-center gap-3">
                  <Switch
                  checked={data.is_global}
                  onCheckedChange={(v)=>setData("is_global",v)}
                  />
                  <span>Global Ad</span>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                  checked={data.status}
                  onCheckedChange={(v)=>setData("status",v)}
                  />
                  <span>Status</span>
                </div>

              </div>


              {/* Categories */}
                <div>
                <label className="text-sm font-medium">Categories</label>

                <div className="grid grid-cols-3 gap-3 mt-3">

                    {categories.map((cat) => {

                    const checked = data.categories.includes(cat.id)

                    return (
                        <div key={cat.id} className="flex items-center space-x-2">

                        <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {

                            if (value) {
                                setData("categories", [...data.categories, cat.id])
                            } else {
                                setData(
                                "categories",
                                data.categories.filter((id) => id !== cat.id)
                                )
                            }

                            }}
                        />

                        <label className="text-sm">{cat.name}</label>

                        </div>
                    )

                    })}

                </div>
                </div>


              {/* Sub Categories */}
                <div>
                <label className="text-sm font-medium">Sub Categories</label>

                <div className="grid grid-cols-3 gap-3 mt-3 max-h-60 overflow-y-auto">

                    {subCategories.map((sub) => {

                    const checked = data.sub_categories.includes(sub.id)

                    return (
                        <div key={sub.id} className="flex items-center space-x-2">

                        <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {

                            if (value) {
                                setData("sub_categories", [...data.sub_categories, sub.id])
                            } else {
                                setData(
                                "sub_categories",
                                data.sub_categories.filter((id) => id !== sub.id)
                                )
                            }

                            }}
                        />

                        <label className="text-sm">{sub.name}</label>

                        </div>
                    )

                    })}

                </div>
                </div>


              <Button disabled={processing}>
                Create Advertisement
              </Button>

            </form>

          </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}