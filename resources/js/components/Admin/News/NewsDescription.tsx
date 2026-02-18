import { lazy, Suspense } from "react"
import { Label } from "@/components/ui/label"
const Editor = lazy(() => import("@/components/common/Editor"))

export default function NewsDescription({ data, setData, errors }: any) {
  return (
    <div className="space-y-2">
      <Label>News Description *</Label>
      <Suspense fallback={<div>Loading editor...</div>}>
        <Editor
          value={data.news_description}
          onChange={(value: string) => setData("news_description", value)}
        />
      </Suspense>
      {errors.news_description && <p className="text-red-500">{errors.news_description}</p>}
    </div>
  )
}
