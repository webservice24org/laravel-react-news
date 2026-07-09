<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsPost;
use Inertia\Inertia;

class ArchiveController extends Controller
{
    public function showArchiveByDate(string $date)
    {
        $news = NewsPost::query()
            ->where('status', 'published')
            ->whereDate('published_at', $date)
            ->latest('published_at')
            ->paginate(12);

        return Inertia::render('Frontend/Archive/Show', [
            'date' => $date,
            'news' => $news,

            'latestNews' => NewsPost::where('status', 'published')
                ->latest('published_at')
                ->take(6)
                ->get(),

            'mostViewedNews' => NewsPost::where('status', 'published')
                ->orderByDesc('view_count')
                ->take(6)
                ->get(),
        ]);
    }
}
