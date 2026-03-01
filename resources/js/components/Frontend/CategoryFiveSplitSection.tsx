"use client"

import React from "react"
import { Link } from "@inertiajs/react"
import type { News } from "@/types/news"
import { getExcerpt } from "@/utils/text"

interface Props {
  title: string
  news: News[]
}

export default function CategoryFiveSplitSection({ title, news }: Props) {
  if (!news?.length) return null

  const getImage = (thumbnail?: string) =>
    thumbnail ? `/storage/${thumbnail}` : "/images/fallback-news.jpg"

  // Make middle item featured
  const featuredIndex = Math.floor(news.length / 2)
  const featured = news[featuredIndex]

  // Remove featured from list
  const sideItems = news.filter((_, i) => i !== featuredIndex)

  // Split remaining items equally
  const half = Math.ceil(sideItems.length / 2)
  const leftItems = sideItems.slice(0, half)
  const rightItems = sideItems.slice(half)

  return (
    <section className="py-10 border-b">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="grid md:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {leftItems.map((item) => (
            <div key={item.id} className="space-y-2">
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
                <h4 className="text-sm font-semibold line-clamp-2 hover:text-red-600 transition">
                  {item.news_title}
                </h4>
              </Link>
            </div>
          ))}
        </div>

        {/* MIDDLE FEATURED */}
        <div className="md:col-span-6 space-y-4">
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
            <h3 className="text-xl font-bold hover:text-red-600 transition">
              {featured.news_title}
            </h3>
          </Link>

          <p className="text-gray-600 line-clamp-3">
            {getExcerpt(featured.news_description, 25)}
          </p>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-3 space-y-6">
          {rightItems.map((item) => (
            <div key={item.id} className="space-y-2">
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
                <h4 className="text-sm font-semibold line-clamp-2 hover:text-red-600 transition">
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