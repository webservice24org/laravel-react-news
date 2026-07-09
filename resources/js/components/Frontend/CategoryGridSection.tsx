"use client"

import React from "react"
declare function route(name: string, params?: any): string
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
  categorySlug: string
}

export default function CategoryGridSection({ title, news, categorySlug }: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  // Take only first 8 news
  const displayNews = news.slice(0, 8)

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
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {displayNews.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >

            {/* IMAGE */}
            <Link href={`/news/${item.slug}`}>
              <img
                src={getImage(item.news_thumbnail)}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover"
              />
            </Link>

            {/* CONTENT */}
            <div className="p-4 space-y-2">

              {/* TITLE */}
              <Link href={`/news/${item.slug}`}>
                <h4 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-red-600 transition leading-snug">
                  {item.news_title}
                </h4>
              </Link>

              {/* EXCERPT (optional hidden or can enable later) */}
              <p className="text-gray-600 text-sm line-clamp-3 hidden">
                {getExcerpt(item.news_description, 15)}
              </p>

            </div>

          </article>
        ))}

    </div>
    </section>
  )
}