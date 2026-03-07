<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\NewsPost;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthorAnalyticsController extends Controller
{

    public function analyticsDashboard(Request $request)
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $totalAuthors = User::count();

        $totalNews = NewsPost::whereMonth('created_at',$month)
            ->whereYear('created_at',$year)
            ->count();

        $topAuthors = User::withCount(['newsPosts'=>function($q) use($month,$year){
            $q->whereMonth('created_at',$month)
            ->whereYear('created_at',$year);
        }])
        ->orderByDesc('news_posts_count')
        ->take(10)
        ->get();

        $topJournalist = $topAuthors->first();

        // Productivity
        $authorProductivity = User::select('users.id','users.name')
            ->withCount(['newsPosts'=>function($q) use($month,$year){
                $q->whereMonth('created_at',$month)
                ->whereYear('created_at',$year);
            }])
            ->orderByDesc('news_posts_count')
            ->take(8)
            ->get();

        // Viral posts
        $viralArticles = NewsPost::select(
                'news_posts.id',
                'news_posts.news_title',
                'news_posts.view_count as views',
                'users.name as author'
            )
            ->join('users','users.id','=','news_posts.user_id')
            ->whereMonth('news_posts.created_at',$month)
            ->whereYear('news_posts.created_at',$year)
            ->orderByDesc('views')
            ->take(5)
            ->get();

        // Author performance score
        $authorScores = User::select(
                'users.name',
                DB::raw('COUNT(news_posts.id) as posts'),
                DB::raw('SUM(news_posts.view_count) as views')
            )
            ->join('news_posts','users.id','=','news_posts.user_id')
            ->whereMonth('news_posts.created_at',$month)
            ->whereYear('news_posts.created_at',$year)
            ->groupBy('users.id','users.name')
            ->orderByDesc('views')
            ->take(6)
            ->get();

        // Category performance
        $categoryPerformance = DB::table('category_news_post')
        ->join('news_posts','news_posts.id','=','category_news_post.news_post_id')
        ->join('categories','categories.id','=','category_news_post.category_id')
        ->select(
            'categories.name',
            DB::raw('COUNT(news_posts.id) as posts')
        )
        ->whereMonth('news_posts.created_at',$month)
        ->whereYear('news_posts.created_at',$year)
        ->groupBy('categories.name')
        ->orderByDesc('posts')
        ->take(6)
        ->get();

        // AI headline success
        $aiHeadlineSuccess = NewsPost::select(
                DB::raw('AVG(view_count) as avg_views')
            )
            ->whereMonth('created_at',$month)
            ->whereYear('created_at',$year)
            ->first();

        // Monthly trend
        $monthlyNewsCounts = NewsPost::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at',$year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return inertia('Admin/AuthorAnalyticsDashboard',[
            'totalAuthors'=>$totalAuthors,
            'totalNews'=>$totalNews,
            'topAuthors'=>$topAuthors,
            'topJournalist'=>$topJournalist,
            'authorProductivity'=>$authorProductivity,
            'viralArticles'=>$viralArticles,
            'authorScores'=>$authorScores,
            'categoryPerformance'=>$categoryPerformance,
            'aiHeadlineSuccess'=>$aiHeadlineSuccess,
            'monthlyNewsCounts'=>$monthlyNewsCounts,
            'month'=>(int)$month,
            'year'=>(int)$year
        ]);
    }
}