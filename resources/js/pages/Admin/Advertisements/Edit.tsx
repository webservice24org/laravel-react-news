declare function route(name: string, params?: any): string

import AppLayout from "@/layouts/app-layout"
import { useForm } from "@inertiajs/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import CheckboxGroup from "@/components/Admin/Advertisement/checkbox-group"


interface Props {
  ad:any
  categories:any[]
  subCategories:any[]
}

export default function Edit({ ad, categories, subCategories }:Props) {

  const [preview,setPreview] = useState(
    ad.ad_image ? `/storage/${ad.ad_image}` : null
  )

  const { data,setData,post,processing } = useForm({

    ad_name: ad.ad_name,
    ad_url: ad.ad_url || "",
    ad_image: null,
    ad_code: ad.ad_code || "",
    is_global: ad.is_global,
    status: ad.status,
    categories: ad.categories.map((c:any)=>c.id),
    sub_categories: ad.sub_categories.map((s:any)=>s.id),

  })

  const submit = (e:any)=>{
    e.preventDefault()

    post(route("admin.advertisements.update", ad.id),{
      forceFormData:true,
      onSuccess:()=>toast.success("Advertisement updated")
    })
  }

  return (
    <AppLayout>

      <div className="max-w-7xl p-10">

        <Card>
            <CardHeader>
                <h1 className="text-2xl font-bold">Edit Advertisement</h1>
            </CardHeader>
            <CardContent>
                <form onSubmit={submit} className="space-y-6">

                    <div>
                        <label>Ad Name</label>
                        <Input
                        value={data.ad_name}
                        onChange={e=>setData("ad_name",e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Ad URL</label>
                        <Input
                        value={data.ad_url}
                        onChange={e=>setData("ad_url",e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Ad Image</label>

                        <Input
                        type="file"
                        onChange={(e:any)=>{

                        const file = e.target.files[0]
                        setData("ad_image",file)

                        if(file){
                            setPreview(URL.createObjectURL(file))
                        }

                        }}
                        />

                        {preview && (
                        <img
                        src={preview}
                        className="w-60 mt-3 rounded border"
                        />
                        )}

                    </div>

                    <div>
                        <label>Ad Code</label>

                        <Textarea
                        value={data.ad_code}
                        onChange={e=>setData("ad_code",e.target.value)}
                        />
                    </div>

                    <div className="flex gap-8">

                        <div className="flex items-center gap-2">
                        <Switch
                        checked={data.is_global}
                        onCheckedChange={(v)=>setData("is_global",v)}
                        />
                        <span>Global</span>
                        </div>

                        <div className="flex items-center gap-2">
                        <Switch
                        checked={data.status}
                        onCheckedChange={(v)=>setData("status",v)}
                        />
                        <span>Status</span>
                        </div>

                    </div>

                    {/* Categories */}

                    <CheckboxGroup
                        items={categories}
                        selected={data.categories}
                        onChange={(val)=>setData("categories",val)}
                        />

                    {/* SubCategories */}

                    <CheckboxGroup
                    items={subCategories}
                    selected={data.sub_categories}
                    onChange={(val)=>setData("sub_categories",val)}
                    />

                    <Button disabled={processing}>
                        Update Advertisement
                    </Button>

                </form>
            </CardContent>
        </Card>

      </div>

    </AppLayout>
  )
}