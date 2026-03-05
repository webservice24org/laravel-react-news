"use client"

import { Head } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import AppLayout from "@/layouts/app-layout"

interface Author {
  id: number
  name: string
  news_posts_count: number
}

interface MonthlyCount {
  month: number
  count: number
}

interface Props {
  totalAuthors: number
  totalNews: number
  topAuthors: Author[]
  monthlyNewsCounts: MonthlyCount[]
}

export default function AuthorAnalyticsDashboard({
  totalAuthors,
  totalNews,
  topAuthors,
  monthlyNewsCounts,
}: Props) {
  // Transform monthly data for chart
  const chartData = monthlyNewsCounts.map(m => ({
    month: `মাস ${m.month}`,
    count: m.count,
  }))

  return (
    <AppLayout>
      <Head>
        <title>Author Analytics Dashboard</title>
      </Head>

      <div className="max-w-350 mx-auto px-8 py-12 space-y-12">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle>মোট লেখক</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalAuthors}</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle>মোট সংবাদ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{totalNews}</p>
            </CardContent>
          </Card>

          {/* Placeholder for future stats */}
          <Card className="text-center hidden lg:block">
            <CardHeader>
              <CardTitle>আজকের সংবাদ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">—</p>
            </CardContent>
          </Card>

          <Card className="text-center hidden lg:block">
            <CardHeader>
              <CardTitle>সর্বাধিক ভিউ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">—</p>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Authors */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Writers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topAuthors.map((author, idx) => (
                <li
                  key={author.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <span className="font-medium">{idx + 1}. {author.name}</span>
                  <span className="font-semibold text-blue-600">{author.news_posts_count} সংবাদ</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Monthly News Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly News Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}