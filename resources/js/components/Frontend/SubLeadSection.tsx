"use client"

import React from "react"
import {Link, usePage } from "@inertiajs/react"
import type { News } from "@/types/news"

interface Props {
  news: News[]
}

export default function SubLeadSection({ news }: Props) {
  const { frontendSettings } = usePage().props as any;
  if (!news?.length) return null

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
  <div className="px-5 py-4 border-b">
    <h2 className="text-xl font-bold">
      {frontendSettings.sub_lead_title || "Sub Lead News"}
    </h2>
  </div>

  <div>
    {news.map((item, index) => (
      <div
        key={item.id}
        className={`group flex gap-4 p-4 hover:bg-gray-50 transition ${
          index !== news.length - 1 ? "border-b" : ""
        }`}
      >
        <Link
          href={`/news/${item.slug}`}
          className="shrink-0"
        >
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={`/storage/${item.news_thumbnail}`}
              alt={item.news_title}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="flex-1">
          <Link href={`/news/${item.slug}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-3 leading-6 group-hover:text-red-600 transition">
              {item.news_title}
            </h3>
          </Link>
        </div>
      </div>
    ))}
  </div>
</div>
  )
}