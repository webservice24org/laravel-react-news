<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\NewsPost;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $range = $request->query('range', 'Daily');
        $now = Carbon::now();

        // 1️⃣ Traffic Data
        $trafficData = [];
        $periods = match($range) {
            'Daily' => 24,   // hourly
            'Weekly' => 7,   // days
            'Monthly' => $now->daysInMonth,
            'Yearly' => 12,  // months
            default => 12,
        };

        for ($i=1;$i<=$periods;$i++){
            $trafficData[] = [
                'period' => match($range) {
                    'Daily' => $i.'h',
                    'Weekly' => 'Day '.$i,
                    'Monthly' => $i.'th',
                    'Yearly' => 'Month '.$i,
                    default => $i,
                },
                'visitors' => rand(50,500), // simulated, can be replaced with real data
            ];
        }

        // 2️⃣ Total stats
        $totalPosts = NewsPost::count();
        $totalAuthors = User::count();
        $totalVisitors = $totalPosts * rand(3,7); // simulation

        // 3️⃣ Most viewed posts
        $mostViewedPosts = NewsPost::orderByDesc('view_count')
            ->take(10)
            ->get(['id','news_title as title','view_count','user_id'])
            ->map(function($post){
                return [
                    'id'=>$post->id,
                    'title'=>$post->title,
                    'view_count'=>$post->view_count,
                    'author'=>$post->author->name ?? 'Unknown'
                ];
            });

        // 4️⃣ Active journalists leaderboard
        $activeJournalists = User::withCount(['newsPosts as current_posts' => function($q) use($range,$now){
            match($range){
                'Daily' => $q->whereDate('created_at', $now->toDateString()),
                'Weekly' => $q->whereBetween('created_at', [$now->startOfWeek(), $now->endOfWeek()]),
                'Monthly' => $q->whereMonth('created_at', $now->month)->whereYear('created_at', $now->year),
                'Yearly' => $q->whereYear('created_at', $now->year),
                default => null,
            };
        }])->orderByDesc('current_posts')
          ->take(10)
          ->get(['id','name']);

        // 5️⃣ Visitor regions for map (simulated for now)
        $visitorRegions = [
            ['region'=>'United States','count'=>rand(50,300)],
            ['region'=>'India','count'=>rand(50,300)],
            ['region'=>'Bangladesh','count'=>rand(50,300)],
            ['region'=>'Germany','count'=>rand(20,150)],
            ['region'=>'Brazil','count'=>rand(10,100)],
        ];

        // 6️⃣ Trending categories
        $trendingCategories = NewsPost::selectRaw('categories.name as category, SUM(view_count) as views')
            ->join('category_news_post','category_news_post.news_post_id','news_posts.id')
            ->join('categories','categories.id','category_news_post.category_id')
            ->groupBy('categories.name')
            ->orderByDesc('views')
            ->take(6)
            ->get()
            ->map(fn($c)=>['category'=>$c->category,'views'=>$c->views]);

        // 7️⃣ Viral articles
        $viralArticles = NewsPost::orderByDesc('view_count')->take(5)
            ->get(['id','news_title as title','view_count','user_id'])
            ->map(fn($p)=>['id'=>$p->id,'title'=>$p->title,'view_count'=>$p->view_count,'author'=>$p->author->name ?? 'Unknown']);

        // 8️⃣ Realtime visitors (can replace with Redis or Pusher for live updates)
        $realtimeVisitors = rand(100,500);

        return Inertia::render('dashboard', [
            'totalPosts' => $totalPosts,
            'totalAuthors' => $totalAuthors,
            'totalVisitors' => $totalVisitors,
            'mostViewedPosts' => $mostViewedPosts,
            'trafficData' => $trafficData,
            'activeJournalists' => $activeJournalists,
            'realtimeVisitors' => $realtimeVisitors,
            'visitorRegions' => $visitorRegions,
            'trendingCategories' => $trendingCategories,
            'viralArticles' => $viralArticles
        ]);
    }
}