"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"

interface CategoryColumn {
  title: string
  news: News[]
}

interface Props {
  categories: CategoryColumn[] // Array of 4 categories
}

export default function FourCategoryBlock({ categories }: Props) {
  if (!categories?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  return (
  <section className="max-w-7xl mx-auto py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {categories.map((category) => {
        if (!category.news?.length) return null

        const [featured, ...listNews] = category.news.slice(0, 6)

        return (
          <div
            key={category.title}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Category Header */}
            <div className="px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-red-600 rounded-full"></div>

                <h2 className="font-bold text-lg text-gray-900">
                  {category.title}
                </h2>
              </div>
            </div>

            <div className="p-4">
              {/* Featured */}
              {featured && (
                <div className="mb-4">
                  <Link href={`/news/${featured.slug}`}>
                    <img
                      src={getImage(featured.news_thumbnail)}
                      alt={featured.news_title}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-16/10 object-cover rounded-lg"
                    />
                  </Link>

                  <Link href={`/news/${featured.slug}`}>
                    <h3 className="mt-3 text-base font-bold leading-snug text-gray-900 hover:text-red-600 transition-colors line-clamp-2">
                      {featured.news_title}
                    </h3>
                  </Link>
                </div>
              )}

              {/* News List */}
              <div className="space-y-3">
                {listNews.map((item) => (
                  <div
                    key={item.id}
                    className="border-t border-gray-100 pt-3"
                  >
                    <Link
                      href={`/news/${item.slug}`}
                      className="flex items-start gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0"></span>

                      <span className="text-sm leading-6 text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2">
                        {item.news_title}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  </section>
)
}