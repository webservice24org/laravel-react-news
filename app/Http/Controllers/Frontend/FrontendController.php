<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsPost;
use App\Models\HomeSection;
use Inertia\Inertia;

class FrontendController extends Controller
{

    public function show(NewsPost $newsPost)
    {
        $newsPost->load([
            'categories',
            'subCategories',
            'tags',
            'author',
        ]);

        $newsPost->increment('view_count');

        $categoryId = $newsPost->categories->first()?->id;

        $relatedNews = collect();

        if ($categoryId) {
            $relatedNews = NewsPost::whereHas('categories', function ($q) use ($categoryId) {
                    $q->where('categories.id', $categoryId);
                })
                ->where('id', '!=', $newsPost->id)
                ->where('status', true)
                ->latest()
                ->take(6)
                ->get();
        }

        return Inertia::render('Frontend/News/Show', [
            'news' => $newsPost,
            'latestNews' => $this->getLatestNews(6, $newsPost->id),
            
        ]);
    }

    private function getLatestNews($limit = 6, $excludeId = null)
    {
        return NewsPost::select('id','news_title','slug','created_at','news_thumbnail')
            ->when($excludeId, function ($query) use ($excludeId) {
                $query->where('id', '!=', $excludeId);
            })
            ->where('status', 1)
            ->orderByDesc('created_at')
            ->take($limit)
            ->get();

        
    }


}
