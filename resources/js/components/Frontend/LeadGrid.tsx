"use client"

import React from "react"
import type { News } from "@/types/news"
import { Link } from "@inertiajs/react"
import { getExcerpt } from "@/utils/text"

interface Props {
  news: News[]
}

export default function LeadGrid({ news }: Props) {
  if (!news?.length) return null

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {news.map((item) => {
        const thumbnail = item.news_thumbnail
          ? `/storage/${item.news_thumbnail}`
          : "/images/fallback-news.jpg"

        return (
          <div
            key={item.id}
            className="space-y-3 group"
          >
            <Link href={`/news/${item.slug}`}>
              <img
                src={thumbnail}
                alt={item.news_title}
                loading="lazy"
                decoding="async"
                className="w-full h-40 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <Link href={`/news/${item.slug}`}>
              <h3 className="font-semibold text-lg line-clamp-2 hover:text-red-600 transition">
                {item.news_title}
              </h3>
            </Link>

            {/* Optional small excerpt line */}
            <p className="hidden text-sm text-gray-600 line-clamp-2">
              {getExcerpt(item.news_description, 15)}
            </p>
          </div>
        )
      })}
    </div>
  )
}