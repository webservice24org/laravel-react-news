import { useEffect, useMemo, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function slugify(input: string) {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-") // keep Bangla too
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export default function NewsTitles({ data, setData, errors }: any) {
  // ✅ keeps auto-slug working until user customizes
  const lastAutoSlugRef = useRef<string>("")
  const autoSlug = useMemo(() => slugify(data.news_title), [data.news_title])

  // WP-like UI states
  const [isEditingSlug, setIsEditingSlug] = useState(false)
  const slugCustomized =
    !!(data.slug || "").trim() && (data.slug || "").trim() !== (lastAutoSlugRef.current || "")

  // ✅ Auto-update slug only if user didn't customize
  useEffect(() => {
    const current = (data.slug || "").trim()

    if (!current || current === lastAutoSlugRef.current) {
      setData("slug", autoSlug)
      lastAutoSlugRef.current = autoSlug
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSlug])

  const baseUrl = "/news" // change if your public url is different (e.g. "/posts" or route(...))
  const slugPreview = `${baseUrl}/${(data.slug || "").trim() || autoSlug}`

  const resetToAuto = () => {
    setData("slug", autoSlug)
    lastAutoSlugRef.current = autoSlug
    setIsEditingSlug(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Top Title</Label>
        <Input
          value={data.top_title}
          onChange={(e) => setData("top_title", e.target.value)}
          placeholder="Optional top title"
        />
        {errors.top_title && <p className="text-red-500">{errors.top_title}</p>}
      </div>

      <div>
        <Label>News Title *</Label>
        <Input
          value={data.news_title}
          onChange={(e) => setData("news_title", e.target.value)}
          placeholder="News title"
        />
        {errors.news_title && <p className="text-red-500">{errors.news_title}</p>}
      </div>

      <div>
        <Label>Hanger Title</Label>
        <Input
          value={data.hanger_title}
          onChange={(e) => setData("hanger_title", e.target.value)}
          placeholder="Optional hanger title"
        />
        {errors.hanger_title && <p className="text-red-500">{errors.hanger_title}</p>}
      </div>

      {/* ✅ WordPress-style slug row */}
      <div className="space-y-2">
        <Label>Slug</Label>

        {/* Preview row */}
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          Permalink:{" "}
          <span className="font-mono text-neutral-800 dark:text-neutral-100">{slugPreview}</span>
        </div>

        {!isEditingSlug ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded border bg-neutral-50 px-3 py-2 text-sm font-mono text-neutral-800 dark:bg-gray-900 dark:text-neutral-100">
              {(data.slug || "").trim() || autoSlug || "—"}
            </div>

            <Button
              type="button"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
              onClick={() => setIsEditingSlug(true)}
            >
              Edit
            </Button>

            {slugCustomized && (
              <Button
                type="button"
                variant="secondary"
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100"
                onClick={resetToAuto}
              >
                Reset
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              value={data.slug}
              onChange={(e) => setData("slug", e.target.value)}
              placeholder="Custom slug"
              className="font-mono"
            />

            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => setIsEditingSlug(false)}
            >
              OK
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
              onClick={() => {
                // cancel edit -> if empty, revert to auto
                if (!(data.slug || "").trim()) resetToAuto()
                else setIsEditingSlug(false)
              }}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="bg-neutral-200 hover:bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100"
              onClick={resetToAuto}
            >
              Reset to auto
            </Button>
          </div>
        )}

        {errors.slug && <p className="text-red-500">{errors.slug}</p>}
      </div>
    </div>
  )
}
