"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"

declare function route(name: string, params?: any): string

interface Props {
  title: string
  news: News[]
  categorySlug: string
}

export default function CategoryFourPremiumSection({
  title,
  news,
  categorySlug,
}: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail
      ? `/storage/${thumbnail}`
      : "/images/fallback-news.jpg"

  const displayNews = news.slice(0, 4)

  return (
    <section className="max-w-7xl mx-auto py-8">

      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-red-600 rounded-full" />

          <Link href={route("category.show", categorySlug)}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 hover:text-red-600 transition-colors">
              {title}
            </h2>
          </Link>
        </div>

        <Link
          href={route("category.show", categorySlug)}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          আরও →
        </Link>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {displayNews.map((item) => (
          <article
            key={item.id}
            className="group"
          >
            {/* Image */}
            <Link
              href={`/news/${item.slug}`}
              className="block overflow-hidden"
            >
              <img
                src={getImage(item.news_thumbnail)}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                className="w-full aspect-4/3 object-cover rounded-md"
              />
            </Link>

            {/* Content */}
            <div className="pt-4">

              <Link href={`/news/${item.slug}`}>
                <h3 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-red-600 transition-colors line-clamp-3">
                  {item.news_title}
                </h3>
              </Link>

            </div>

            {/* Divider */}
            <div className="mt-5 border-r hidden border-gray-200" />
          </article>
        ))}

      </div>

    </section>
  )
}