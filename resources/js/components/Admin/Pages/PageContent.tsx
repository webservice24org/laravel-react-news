import { lazy, Suspense } from "react"
import { Label } from "@/components/ui/label"

const Editor = lazy(() => import("@/components/common/Editor"))

export default function PageContent({ data, setData, errors }: any) {
  return (
    <div className="space-y-2">
      <Label>Page Content</Label>

      <Suspense fallback={<div>Loading editor...</div>}>
        <Editor
          value={data.content}
          onChange={(value: string) => setData("content", value)}
        />
      </Suspense>

      {errors.content && (
        <p className="text-red-500">{errors.content}</p>
      )}
    </div>
  )
}