declare function route(name: string): string

import AppLayout from "@/layouts/app-layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

interface Props {

  visitors:number
  pageViews:number
  sessions:number
  activeUsers:number

  dailyStats:any[]
  topPages:any[]
  topCountries:any[]
  deviceBreakdown:any[]
}

export default function Dashboard({
  visitors,
  pageViews,
  sessions,
  activeUsers,
  dailyStats,
  topPages,
  topCountries,
  deviceBreakdown
}:Props){

return(

<AppLayout>

<div className="p-10 space-y-6">

{/* KPI CARDS */}

<div className="grid grid-cols-4 gap-6">

<Card>
<CardHeader>
<CardTitle>Visitors</CardTitle>
</CardHeader>
<CardContent className="text-3xl font-bold">
{visitors}
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Page Views</CardTitle>
</CardHeader>
<CardContent className="text-3xl font-bold">
{pageViews}
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Sessions</CardTitle>
</CardHeader>
<CardContent className="text-3xl font-bold">
{sessions}
</CardContent>
</Card>

<Card>
<CardHeader>
<CardTitle>Active Users</CardTitle>
</CardHeader>
<CardContent className="text-3xl font-bold text-green-600">
{activeUsers}
</CardContent>
</Card>

</div>


{/* VISITOR CHART */}

<Card>

<CardHeader>
<CardTitle>Visitors (Last 30 Days)</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={dailyStats}>

<XAxis dataKey="date"/>
<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="visitors"
stroke="#2563eb"
strokeWidth={2}
/>

<Line
type="monotone"
dataKey="pageViews"
stroke="#16a34a"
strokeWidth={2}
/>

</LineChart>

</ResponsiveContainer>

</CardContent>

</Card>


{/* TABLE SECTION */}

<div className="grid grid-cols-3 gap-6">

{/* TOP PAGES */}

<Card>

<CardHeader>
<CardTitle>Top Pages</CardTitle>
</CardHeader>

<CardContent>

<table className="w-full text-sm">

<thead>
<tr className="border-b">
<th className="text-left">Page</th>
<th>Views</th>
</tr>
</thead>

<tbody>

{topPages.map((page,i)=>(
<tr key={i} className="border-b">

<td className="py-2">
{page.pageTitle}
</td>

<td className="text-center">
{page.pageViews}
</td>

</tr>
))}

</tbody>

</table>

</CardContent>

</Card>


{/* COUNTRIES */}

<Card>

<CardHeader>
<CardTitle>Top Countries</CardTitle>
</CardHeader>

<CardContent>

{topCountries.map((c,i)=>(

<div key={i} className="flex justify-between py-2 border-b">

<span>{c.country}</span>
<span>{c.totalUsers}</span>

</div>

))}

</CardContent>

</Card>


{/* DEVICES */}

<Card>

<CardHeader>
<CardTitle>Devices</CardTitle>
</CardHeader>

<CardContent>

{deviceBreakdown.map((d,i)=>(

<div key={i} className="flex justify-between py-2 border-b">

<span>{d.deviceCategory}</span>
<span>{d.totalUsers}</span>

</div>

))}

</CardContent>

</Card>

</div>

</div>

</AppLayout>

)

}