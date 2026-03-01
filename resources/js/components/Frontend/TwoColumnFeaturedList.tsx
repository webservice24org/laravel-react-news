"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
}

export default function TwoColumnFeaturedList({ title, news }: Props) {
  if (!news?.length) return null

  const [featured, ...listNews] = news.slice(0, 6)

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  return (
    <section className="py-10 border-b">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Featured */}
        <div className="md:col-span-6 space-y-4">
          {featured && (
            <>
              <Link href={`/news/${featured.slug}`}>
                <img
                  src={getImage(featured.news_thumbnail)}
                  alt={featured.news_title}
                  className="w-full h-64 object-cover rounded-md"
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <Link href={`/news/${featured.slug}`}>
                <h3 className="text-xl font-bold hover:text-red-600 transition">
                  {featured.news_title}
                </h3>
              </Link>

              <p className="text-gray-600 line-clamp-3">
                {getExcerpt(featured.news_description, 25)}
              </p>
            </>
          )}
        </div>

        {/* Right List */}
        <div className="md:col-span-6 space-y-4">
          {listNews.map((item) => (
            <div key={item.id} className="flex gap-3 items-center">
              <Link href={`/news/${item.slug}`}>
                <img
                  src={getImage(item.news_thumbnail)}
                  alt={item.news_title}
                  className="w-20 h-20 object-cover rounded-md"
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <Link href={`/news/${item.slug}`}>
                <h4 className="font-semibold line-clamp-2 hover:text-red-600 transition">
                  {item.news_title}
                </h4>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}