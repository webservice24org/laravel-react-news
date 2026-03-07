"use client"

import { Head, router } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import AppLayout from "@/layouts/app-layout"
import { useState } from "react"

interface Author {
  id: number
  name: string
  news_posts_count: number
}

interface ViralArticle {
  id: number
  title: string
  views: number
  author: string
}

interface MonthlyCount {
  month: number
  count: number
}

interface Props {
  totalAuthors: number
  totalNews: number
  topAuthors: Author[]
  topJournalist: Author | null
  authorProductivity: Author[]
  viralArticles: ViralArticle[]
  monthlyNewsCounts: MonthlyCount[]
  month: number
  year: number
  categoryPerformance: { name: string; posts: number }[]
  authorScores: { name: string; views: number }[]
  aiHeadlineSuccess: { avg_views: number } | null
}

export default function AuthorAnalyticsDashboard(props: Props) {

  const {
    totalAuthors,
    totalNews,
    topAuthors,
    topJournalist,
    authorProductivity,
    viralArticles,
    monthlyNewsCounts,
    categoryPerformance,
    authorScores,
    aiHeadlineSuccess
  } = props

  const [month, setMonth] = useState(props.month?.toString() ?? "")
  const [year, setYear] = useState(props.year?.toString() ?? "")

  const months = [
    "জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন",
    "জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"
  ]

  const currentYear = new Date().getFullYear()

  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYear - 5 + i).toString()
  )

  const updateFilter = (m:string|number|null, y:string|number|null) => {

    router.get(
      "/admin/authors/analytics",
      {
        month: m ?? "",
        year: y ?? ""
      },
      { preserveState: true, replace: true }
    )
  }

  /* Quick Filters */

  const setThisMonth = () => {
    const now = new Date()
    const m = (now.getMonth()+1).toString()
    const y = now.getFullYear().toString()

    setMonth(m)
    setYear(y)
    updateFilter(m,y)
  }

  const setLastMonth = () => {
    const now = new Date()
    now.setMonth(now.getMonth()-1)

    const m = (now.getMonth()+1).toString()
    const y = now.getFullYear().toString()

    setMonth(m)
    setYear(y)
    updateFilter(m,y)
  }

  const setThisYear = () => {
    const y = new Date().getFullYear().toString()
    setYear(y)
    setMonth("")
    updateFilter("",y)
  }

  const setLastYear = () => {
    const y = (new Date().getFullYear()-1).toString()
    setYear(y)
    setMonth("")
    updateFilter("",y)
  }

  const setAllTime = () => {
    setMonth("")
    setYear("")
    updateFilter(null,null)
  }

  const chartData = monthlyNewsCounts.map(m => ({
    month: `মাস ${m.month}`,
    count: m.count
  }))

  const productivityData = authorProductivity.map(a => ({
    name: a.name,
    posts: a.news_posts_count
  }))

  return (
    <AppLayout>
      <Head title="Author Analytics Dashboard" />

      <div className="max-w-350 mx-auto px-8 py-12 space-y-10">

        {/* Quick Filters */}

        <div className="flex flex-wrap gap-3">

          <Button onClick={setThisMonth}>This Month</Button>
          <Button variant="secondary" onClick={setLastMonth}>Last Month</Button>
          <Button variant="outline" onClick={setThisYear}>This Year</Button>
          <Button variant="outline" onClick={setLastYear}>Last Year</Button>
          <Button variant="ghost" onClick={setAllTime}>All Time</Button>

        </div>

        {/* Month / Year Filters */}

        <div className="flex gap-4">

          <Select
            value={month}
            onValueChange={(value)=>{
              setMonth(value)
              updateFilter(value,year)
            }}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="মাস নির্বাচন" />
            </SelectTrigger>

            <SelectContent>
              {months.map((m,i)=>(
                <SelectItem key={i} value={(i+1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={year}
            onValueChange={(value)=>{
              setYear(value)
              updateFilter(month,value)
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="বছর" />
            </SelectTrigger>

            <SelectContent>
              {years.map(y=>(
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        </div>

        {/* Journalist of Month */}

        {topJournalist && (
          <Card className="bg-yellow-50 border-yellow-300">
            <CardHeader>
              <CardTitle>🏆 Journalist of the Month</CardTitle>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-3xl font-bold">{topJournalist.name}</p>
              <p className="text-gray-600">
                {topJournalist.news_posts_count} articles published
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats */}

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

        </div>

        {/* Author Productivity */}

        <Card>
          <CardHeader>
            <CardTitle>Author Productivity</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-96">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityData}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="posts" fill="#16a34a"/>
                </BarChart>
              </ResponsiveContainer>

            </div>
          </CardContent>
        </Card>

        {/* Author Performance */}

        <Card>
          <CardHeader>
            <CardTitle>⭐ Author Performance Score</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-96">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={authorScores}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="views" fill="#f59e0b"/>
                </BarChart>
              </ResponsiveContainer>

            </div>
          </CardContent>
        </Card>

        {/* Viral Articles */}

        <Card>
          <CardHeader>
            <CardTitle>🔥 Most Viral Articles</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3">

              {viralArticles.map(post=>(
                <li key={post.id}
                className="flex justify-between bg-gray-50 p-3 rounded-lg">

                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">by {post.author}</p>
                  </div>

                  <span className="font-semibold text-red-600">
                    {post.views} views
                  </span>

                </li>
              ))}

            </ul>
          </CardContent>
        </Card>

        {/* Category Performance */}

        <Card>
          <CardHeader>
            <CardTitle>🏷 Top Performing Categories</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-96">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="posts" fill="#8b5cf6"/>
                </BarChart>
              </ResponsiveContainer>

            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend */}

        <Card>
          <CardHeader>
            <CardTitle>Monthly News Trend</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-96">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="month"/>
                  <YAxis/>
                  <Tooltip/>
                  <Bar dataKey="count" fill="#3b82f6"/>
                </BarChart>
              </ResponsiveContainer>

            </div>
          </CardContent>
        </Card>

        {/* Engagement */}

        <Card>
          <CardHeader>
            <CardTitle>📊 Reader Engagement Snapshot</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">

              {authorScores.map(a=>(
                <div
                key={a.name}
                className="p-4 rounded-lg bg-green-100 text-center">

                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-xs">{a.views} views</p>

                </div>
              ))}

            </div>
          </CardContent>
        </Card>

        {/* AI Headlines */}

        <Card className="bg-blue-50">

          <CardHeader>
            <CardTitle>🤖 AI Headline Avg Views</CardTitle>
          </CardHeader>

          <CardContent className="text-center">

            <p className="text-4xl font-bold">
              {Math.round(aiHeadlineSuccess?.avg_views || 0)}
            </p>

            <p className="text-gray-600">
              Average views from AI generated headlines
            </p>

          </CardContent>

        </Card>

      </div>
    </AppLayout>
  )
}