"use client"

import 'leaflet/dist/leaflet.css';
import { Head, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts"
import VisitorMap from "@/pages/Admin/VisitorMap"

interface Post {
  id: number
  title: string
  view_count: number
  author: string
}

interface Journalist {
  id: number
  name: string
  current_posts: number
}

interface TrafficData {
  period: string
  visitors: number
}

interface VisitorData {
  region: string
  count: number
}

interface CategoryData {
  category: string
  views: number
}

interface Props {
  totalPosts: number
  totalAuthors: number
  totalVisitors: number
  mostViewedPosts: Post[]
  trafficData: TrafficData[]
  activeJournalists: Journalist[]
  realtimeVisitors: number
  visitorRegions: VisitorData[]
  trendingCategories: CategoryData[]
  viralArticles: Post[]
}

const timeRanges = ["Daily", "Weekly", "Monthly", "Yearly", "All Time"]

export default function Dashboard({
  totalPosts,
  totalAuthors,
  totalVisitors,
  mostViewedPosts,
  trafficData,
  activeJournalists,
  realtimeVisitors,
  visitorRegions,
  trendingCategories,
  viralArticles
}: Props) {

  const [selectedRange, setSelectedRange] = useState("Daily")
  const [liveVisitors, setLiveVisitors] = useState(realtimeVisitors)
  const [sortField, setSortField] = useState<'view_count'|'title'>('view_count')
  const [sortOrder, setSortOrder] = useState<'asc'|'desc'>('desc')

  // Live visitors simulation / WebSocket hook placeholder
  useEffect(()=>{
    const interval = setInterval(()=>{
      setLiveVisitors(prev => Math.max(0, prev + Math.floor(Math.random()*10 - 5)))
    },3000)
    return ()=> clearInterval(interval)
  },[])

  // Define allowed sort fields
type PostSortField = 'title' | 'view_count';

const sortedPosts = [...mostViewedPosts].sort((a, b) => {
  const valA = a[sortField as PostSortField];
  const valB = b[sortField as PostSortField];

  if (typeof valA === 'number' && typeof valB === 'number') {
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  }

  // If string, do localeCompare
  if (typeof valA === 'string' && typeof valB === 'string') {
    return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  }

  return 0; // fallback
});

  // Map config
  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

  return (
    <AppLayout breadcrumbs={[{title:"Dashboard", href:"/dashboard"}]}>
      <Head title="Dashboard" />
      <div className="max-w-7xl px-2 py-2 space-y-2">

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-blue-50">
            <CardHeader><CardTitle>Total Posts</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{totalPosts}</p></CardContent>
          </Card>
          <Card className="text-center bg-green-50">
            <CardHeader><CardTitle>Total Authors</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{totalAuthors}</p></CardContent>
          </Card>
          <Card className="text-center bg-red-50">
            <CardHeader><CardTitle>Realtime Visitors</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{liveVisitors}</p></CardContent>
          </Card>
        </div>

        {/* Traffic Filter */}
        <div className="flex gap-4 items-center">
          <span className="font-semibold">Traffic Filter:</span>
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Select range"/></SelectTrigger>
            <SelectContent>
              {timeRanges.map(r=><SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Traffic Line Chart */}
        <Card>
          <CardHeader><CardTitle>📈 Traffic Growth ({selectedRange})</CardTitle></CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <XAxis dataKey="period"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
                <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={3}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Viewed Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>🔥 Most Viewed Posts</CardTitle>
            <div className="flex gap-2 mt-2">
              <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>{setSortField('view_count'); setSortOrder(sortOrder==='asc'?'desc':'asc')}}>
                Sort by Views ({sortOrder})
              </button>
              <button className="px-2 py-1 bg-gray-100 rounded" onClick={()=>setSortField('title')}>
                Sort by Title
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Author</th>
                  <th className="border px-4 py-2">Views</th>
                </tr>
              </thead>
              <tbody>
                {sortedPosts.map((p, idx)=>(
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{idx+1}</td>
                    <td className="border px-4 py-2">{p.title}</td>
                    <td className="border px-4 py-2">{p.author}</td>
                    <td className="border px-4 py-2 font-semibold text-red-600">{p.view_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Active Journalists */}
        <Card>
          <CardHeader><CardTitle>👨‍💻 Active Journalists</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {activeJournalists.map((j,idx)=>(
              <div key={j.id} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>{idx+1}. {j.name}</span>
                <span className="font-semibold text-blue-600">{j.current_posts} posts</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Viral Article Notifications */}
        <Card>
          <CardHeader><CardTitle>🔥 Viral Articles</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {viralArticles.map(v=>(
              <div key={v.id} className="flex justify-between bg-yellow-50 p-3 rounded-lg">
                <span className="font-medium">{v.title} - <small>{v.author}</small></span>
                <span className="font-semibold text-red-600">{v.view_count} views</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Trending Categories */}
        <Card>
          <CardHeader><CardTitle>🏷 Top Categories</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            {trendingCategories.map(cat=>(
              <div key={cat.category} className="p-2 bg-green-100 rounded text-center">
                <p className="font-medium">{cat.category}</p>
                <p className="text-sm">{cat.views} views</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Map of Live Visitors */}
        <Card>
        <CardHeader>
            <CardTitle>🌍 Live Visitors Map</CardTitle>
        </CardHeader>
        <CardContent>
            <VisitorMap
            visitors={[
                { id: 1, lat: 23.8103, lng: 90.4125, count: 120 }, // Dhaka
                { id: 2, lat: 22.3569, lng: 91.7832, count: 80 },  // Chittagong
                { id: 3, lat: 24.3636, lng: 88.6241, count: 50 },  // Rajshahi
            ]}
            />
        </CardContent>
        </Card>

      </div>
    </AppLayout>
  )
}