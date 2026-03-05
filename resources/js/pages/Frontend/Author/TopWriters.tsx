"use client"

import { Head, Link } from "@inertiajs/react"
import FrontendLayout from "@/layouts/frontend-layout"

declare function route(name: string, params?: any): string

interface Author {
  id: number
  name: string
  news_posts_count: number
  is_verified?: boolean
  profile?: {
    profile_photo?: string
  }
}

export default function TopWriters({ authors }: { authors: Author[] }) {
  return (
    <FrontendLayout>
      <Head>
        <title>Top Writers | আপনার নিউজ পোর্টাল</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">সেরা ১০ জন লেখক</h1>

        <div className="space-y-4">

          {authors.map((author, index) => (
            <Link
              key={author.id}
              href={route("author.show", author.id)}
              className="flex items-center gap-4 border p-4 rounded hover:shadow transition"
            >
              <span className="text-xl font-bold w-8">{index + 1}</span>

              {author.profile?.profile_photo ? (
                <img
                  src={`/storage/${author.profile.profile_photo}`}
                  className="w-12 h-12 rounded-full object-cover"
                  alt={author.name}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                  {author.name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <h3 className="font-semibold flex items-center gap-2">
                  {author.name}
                  {author.is_verified && (
                    <span
                      className="text-blue-600 font-semibold text-sm"
                      title="Verified Journalist"
                    >
                      ✔
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">
                  মোট সংবাদ: {author.news_posts_count}
                </p>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </FrontendLayout>
  )
}