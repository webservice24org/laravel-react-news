"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
}

export default function CategoryGridSection({ title, news }: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  // Take only first 8 news
  const displayNews = news.slice(0, 8)

  return (
    <section className="max-w-7xl mx-auto py-2 border-b">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayNews.map((item) => (
          <div key={item.id} className="space-y-2">
            <Link href={`/news/${item.slug}`}>
              <img
                src={getImage(item.news_thumbnail)}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover rounded-md"
              />
            </Link>

            <Link href={`/news/${item.slug}`}>
              <h4 className="text-sm font-semibold line-clamp-2 hover:text-red-600 transition">
                {item.news_title}
              </h4>
            </Link>

            <p className="text-gray-600 text-sm line-clamp-3">
              {getExcerpt(item.news_description, 15)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}