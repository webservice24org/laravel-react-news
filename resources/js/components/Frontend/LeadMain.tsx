"use client"

import React from "react"
import type { News } from "@/types/news"
import { Link } from "@inertiajs/react"
import { getExcerpt } from "@/utils/text"

interface Props {
  news: News
}

export default function LeadMain({ news }: Props) {
  const thumbnail = news.news_thumbnail
    ? `/storage/${news.news_thumbnail}`
    : "/images/fallback-news.jpg"

  return (
    <div className="grid md:grid-cols-2 gap-6 items-center border-b pb-6">

      {/* Left Content */}
      <div>
        <Link href={`/news/${news.slug}`}>
          <h1 className="text-3xl font-bold leading-snug mb-4 hover:text-red-600 transition">
            {news.news_title}
          </h1>
        </Link>

        <p className="text-gray-700 leading-relaxed">
          {getExcerpt(news.news_description, 25)}
        </p>
      </div>

      {/* Right Thumbnail */}
      <div>
        <Link href={`/news/${news.slug}`}>
          <img
            src={thumbnail}
            alt={news.news_title}
            loading="lazy"
            decoding="async"
            className="w-full h-64 object-cover rounded-lg"
          />
        </Link>
      </div>

    </div>
  )
}