declare function route(name: string): string

import AppLayout from "@/layouts/app-layout"
import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card"

import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer,
 BarChart,
 Bar,
 PieChart,
 Pie,
 Cell
} from "recharts"

interface Props{

visitors:number
pageViews:number
activeUsers:number

hourlyTraffic:any[]
topPagesToday:any[]
trafficSources:any[]
countries:any[]
devices:any[]
topReferrers:any[]

}


export default function ProDashboard(props:Props){

return(

<AppLayout>

<div className="p-10 space-y-6">

{/* KPI */}

<div className="grid grid-cols-3 gap-6">

<Card>
<CardHeader><CardTitle>Visitors</CardTitle></CardHeader>
<CardContent className="text-3xl font-bold">
{props.visitors}
</CardContent>
</Card>

<Card>
<CardHeader><CardTitle>Page Views</CardTitle></CardHeader>
<CardContent className="text-3xl font-bold">
{props.pageViews}
</CardContent>
</Card>

<Card>
<CardHeader><CardTitle>Live Users</CardTitle></CardHeader>
<CardContent className="text-3xl text-green-600">
{props.activeUsers}
</CardContent>
</Card>

</div>


{/* HOURLY TRAFFIC */}

<Card>

<CardHeader>
<CardTitle>Traffic Today (Hourly)</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={props.hourlyTraffic}>

<XAxis dataKey="hour"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="sessions"/>

</BarChart>

</ResponsiveContainer>

</CardContent>

</Card>


{/* SOURCES + DEVICES */}

<div className="grid grid-cols-2 gap-6">

<Card>

<CardHeader>
<CardTitle>Traffic Sources</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={props.trafficSources}
dataKey="sessions"
nameKey="source"
outerRadius={120}
/>

</PieChart>

</ResponsiveContainer>

</CardContent>

</Card>


<Card>

<CardHeader>
<CardTitle>Devices</CardTitle>
</CardHeader>

<CardContent>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={props.devices}
dataKey="users"
nameKey="device"
outerRadius={120}
/>

</PieChart>

</ResponsiveContainer>

</CardContent>

</Card>

</div>


{/* TOP PAGES */}

<Card>

<CardHeader>
<CardTitle>Top Pages Today</CardTitle>
</CardHeader>

<CardContent>

<table className="w-full text-sm">

<thead>
<tr className="border-b">
<th>Page</th>
<th>Views</th>
</tr>
</thead>

<tbody>

{props.topPagesToday.map((p,i)=>(

<tr key={i} className="border-b">

<td>{p.title}</td>
<td className="text-center">{p.views}</td>

</tr>

))}

</tbody>

</table>

</CardContent>

</Card>


{/* REFERRERS */}

<Card>

<CardHeader>
<CardTitle>Top Referrers</CardTitle>
</CardHeader>

<CardContent>

{props.topReferrers.map((r,i)=>(

<div key={i} className="flex justify-between border-b py-2">

<span>{r.pageReferrer}</span>
<span>{r.sessions}</span>

</div>

))}

</CardContent>

</Card>

</div>

</AppLayout>

)
}