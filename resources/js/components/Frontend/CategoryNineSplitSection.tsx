"use client"

declare function route(name: string, params?: any): string
import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
  categorySlug: string
}

export default function CategoryNineSplitSection({ title, news, categorySlug }: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  const count = news.length
  const featured = news[count - 1] // last item as featured

  // Take first 8 for left, right, bottom
  const sideItems = news.slice(0, count - 1)

  const leftItems = sideItems.slice(0, 2)
  const rightItems = sideItems.slice(2, 4)
  const bottomItems = sideItems.slice(4, 8)

  return (
    <section className="max-w-7xl mt-8 mx-auto py-2">
      <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-red-600 rounded-full" />
              {categorySlug && (
              <Link
                href={route("category.show", categorySlug)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {title}
              </h2>
              </Link>
            )}
            </div>
      
            
          </div>

      <div className="grid md:grid-cols-12 gap-6">

        {/* LEFT 2 */}
        <div className="md:col-span-3 space-y-6">
          {leftItems.map((item) => (
            <div key={item.id} className="space-y-2 group">
              <Link href={`/news/${item.slug}`}>
                <img
                  src={getImage(item.news_thumbnail)}
                  alt={item.news_title}
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="200"
                  className="w-full h-36 object-cover rounded-md"
                />
              </Link>
              <Link href={`/news/${item.slug}`}>
                <h4 className="mt-2 text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                  {item.news_title}
                </h4>
              </Link>
            </div>
          ))}
        </div>

        {/* MIDDLE FEATURED */}
        <div className="md:col-span-6 space-y-4 group">
          {featured && (
            <>
              <Link href={`/news/${featured.slug}`}>
                <img
                  src={getImage(featured.news_thumbnail)}
                  alt={featured.news_title}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="350"
                  className="w-full h-64 object-cover rounded-md"
                />
              </Link>
              <Link href={`/news/${featured.slug}`}>
                <h4 className="text-2xl mt-2 md:text-3xl font-bold leading-tight text-gray-900 group-hover:text-red-600 transition">
                  {featured.news_title}
                </h4>
              </Link>
              <p className="text-gray-600 line-clamp-3">
                {getExcerpt(featured.news_description, 25)}
              </p>
            </>
          )}
        </div>

        {/* RIGHT 2 */}
        <div className="md:col-span-3 space-y-6">
          {rightItems.map((item) => (
            <div key={item.id} className="space-y-2 group">
              <Link href={`/news/${item.slug}`}>
                <img
                  src={getImage(item.news_thumbnail)}
                  alt={item.news_title}
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="200"
                  className="w-full h-36 object-cover rounded-md"
                />
              </Link>
              <Link href={`/news/${item.slug}`}>
                <h4 className="mt-2 text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                  {item.news_title}
                </h4>
              </Link>
            </div>
          ))}
        </div>

      </div>

      {/* BOTTOM 4 */}
      {bottomItems.length > 0 && (
        <div className="grid grid-cols-4 gap-6 mt-6">
          {bottomItems.map((item) => (
            <div key={item.id} className="space-y-2 group">
              <Link href={`/news/${item.slug}`}>
                <img
                  src={getImage(item.news_thumbnail)}
                  alt={item.news_title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-32 object-cover rounded-md"
                />
              </Link>
              <Link href={`/news/${item.slug}`}>
                <h4 className="mt-2 text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition">
                  {item.news_title}
                </h4>
              </Link>
            </div>
          ))}
        </div>
      )}

    </section>
  )
}