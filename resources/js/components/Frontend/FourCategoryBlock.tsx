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
    <section className="max-w-7xl mx-auto py-2 border-b">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          if (!category.news?.length) return null

          const [featured, ...listNews] = category.news.slice(0, 6)

          return (
            <div key={category.title} className="space-y-4">
              <h2 className="text-xl font-bold">{category.title}</h2>

              {/* Featured News */}
              {featured && (
                <div className="space-y-2">
                  <Link href={`/news/${featured.slug}`}>
                    <img
                      src={getImage(featured.news_thumbnail)}
                      alt={featured.news_title}
                      className="w-full h-40 object-cover rounded-md"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <Link href={`/news/${featured.slug}`}>
                    <h3 className="text-sm font-semibold line-clamp-2 hover:text-red-600 transition">
                      {featured.news_title}
                    </h3>
                  </Link>
                </div>
              )}

              {/* List News */}
              <ul className="space-y-1 mt-2">
                {listNews.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-sm line-clamp-2 hover:text-red-600 transition block"
                    >
                      {item.news_title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}