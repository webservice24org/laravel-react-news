"use client"

import { Head } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"

interface Author {
  id: number
  name: string
  news_posts_count: number
}

interface Props {
  authors: Author[]
  month: number
  year: number
}

export default function AuthorMonthlyRanking({ authors, month, year }: Props) {

  return (
    <AppLayout>
      <Head>
        <title>{year} সালের {month} মাসের সেরা লেখক | Admin Analytics</title>
      </Head>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          {year} সালের {month} মাসের সেরা লেখক
        </h1>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">লেখক</th>
              <th className="border px-4 py-2">সংবাদ সংখ্যা</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author, index) => (
              <tr key={author.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{author.name}</td>
                <td className="border px-4 py-2">{author.news_posts_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  )
}