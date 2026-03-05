<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\NewsPost;
use App\Models\Category;
use Illuminate\Http\Request;

class AuthorAnalyticsController extends Controller
{
    public function monthlyRanking(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $authors = User::withCount(['newsPosts as monthly_news_count' => function($q) use ($month, $year) {
            $q->whereYear('created_at', $year)
              ->whereMonth('created_at', $month);
        }])
        ->orderByDesc('monthly_news_count')
        ->get();

        return inertia('Admin/AuthorMonthlyRanking', [
            'authors' => $authors,
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function analyticsDashboard()
    {
        $totalAuthors = User::count();
        $totalNews = NewsPost::count();

        $topAuthors = User::withCount('newsPosts')
            ->orderByDesc('news_posts_count')
            ->take(10)
            ->get();

        $monthlyNewsCounts = NewsPost::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return inertia('Admin/AuthorAnalyticsDashboard', [
            'totalAuthors' => $totalAuthors,
            'totalNews' => $totalNews,
            'topAuthors' => $topAuthors,
            'monthlyNewsCounts' => $monthlyNewsCounts,
        ]);
    }
}