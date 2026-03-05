<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsPost;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\User;
use App\Models\HomeSection;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;
use Dompdf\Dompdf;
use Dompdf\Options;

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
                ->where('status', 'published')
                ->latest()
                ->take(6)
                ->get();
        }

        $previous = NewsPost::where('status', 'published')
            ->where('id', '<', $newsPost->id)
            ->latest('id')
            ->first();

        $next = NewsPost::where('status', 'published')
            ->where('id', '>', $newsPost->id)
            ->oldest('id')
            ->first();

        return Inertia::render('Frontend/News/Show', [
            'news' => $newsPost,
            'latestNews' => $this->getLatestNews(6, $newsPost->id),
            'mostViewedNews' => $this->getMostViewedNews(6, $newsPost->id),
            'relatedNews' => $this->getRelatedNewsByCategory($newsPost, 6),
            'previousNews' => $previous,
            'nextNews' => $next,
            
        ]);
    }
        
    private function getLatestNews($limit = 6, $excludeId = null)
    {
    return NewsPost::select('id','news_title','slug','created_at','news_thumbnail')
        ->when($excludeId, function ($query) use ($excludeId) {
            $query->where('id', '!=', $excludeId);
        })
        ->where('status', 'published')
        ->orderByDesc('created_at')
        ->take($limit)
        ->get();

    
    }

    private function getMostViewedNews($limit = 6, $excludeId = null)
    {
        return NewsPost::select('id','news_title','slug','created_at','news_thumbnail','view_count')
            ->when($excludeId, fn($query) =>
                $query->where('id', '!=', $excludeId)
            )
            ->where('status', 'published')
            ->orderByDesc('view_count')
            ->take($limit)
            ->get();
    }

    private function getRelatedNewsByCategory($newsPost, $limit = 6)
    {
        $categoryId = $newsPost->categories->first()?->id;

        if (!$categoryId) {
            return collect();
        }

        return NewsPost::select('id','news_title','slug','created_at','news_thumbnail')
            ->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            })
            ->where('id', '!=', $newsPost->id)
            ->where('status', 'published')
            ->latest()
            ->take($limit)
            ->get();
    }





    public function downloadPdf($slug)
    {
        $news = NewsPost::with(['categories', 'author'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $pdf = Pdf::loadView('news.pdf', compact('news'))
            ->setPaper('A4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'isFontSubsettingEnabled' => true,
                'defaultFont' => 'SolaimanLipi',
            ]);

        return $pdf->download(Str::slug($news->news_title).'.pdf');
    }

    public function category($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        $news = NewsPost::with(['categories', 'author'])
            ->whereHas('categories', function ($query) use ($category) {
                $query->where('categories.id', $category->id);
            })
            ->where('status', 'published')
            ->latest()
            ->paginate(12);

        $latestNews = NewsPost::where('status', 'published')
            ->latest()
            ->take(5)
            ->get();

        $mostViewedNews = NewsPost::where('status', 'published')
            ->orderByDesc('view_count')
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Category/Category', [
            'category' => $category,
            'news' => $news,
            'latestNews' => $latestNews,
            'mostViewedNews' => $mostViewedNews,
        ]);
    }



    public function subCategory($categorySlug, $subSlug)
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();

        $subCategory = SubCategory::where('slug', $subSlug)
            ->where('category_id', $category->id)
            ->firstOrFail();

        $news = NewsPost::with(['categories', 'author'])
            ->whereHas('subCategories', function ($query) use ($subCategory) {
                $query->where('sub_categories.id', $subCategory->id);
            })
            ->where('status', 'published')
            ->latest()
            ->paginate(12);

        $latestNews = NewsPost::where('status', 'published')
            ->latest()
            ->take(5)
            ->get();

        $mostViewedNews = NewsPost::where('status', 'published')
            ->orderByDesc('view_count')
            ->take(5)
            ->get();

        return Inertia::render('Frontend/SubCategory/SubCategory', [
            'category' => $category,
            'subCategory' => $subCategory,
            'news' => $news,
            'latestNews' => $latestNews,
            'mostViewedNews' => $mostViewedNews,
        ]);
    }



    public function author($id)
    {
        $author = User::with('profile')
            ->withCount(['newsPosts' => function ($query) {
                $query->where('status', 'published');
            }])
            ->findOrFail($id);

        $news = NewsPost::with(['categories'])
            ->where('user_id', $author->id)
            ->where('status', 'published')
            ->latest()
            ->paginate(12);

        $latestNews = NewsPost::where('status', 'published')
            ->latest()
            ->take(5)
            ->get();

        $mostViewedNews = NewsPost::where('status', 'published')
            ->orderByDesc('view_count')
            ->take(5)
            ->get();

        return Inertia::render('Frontend/Author/AuthorPage', [
            'author' => $author,
            'news' => $news,
            'latestNews' => $latestNews,
            'mostViewedNews' => $mostViewedNews,
        ]);
    }

    public function topWriters()
    {
        $authors = User::with('profile')
            ->withCount(['newsPosts' => function ($query) {
                $query->where('status', 'published');
            }])
            ->orderByDesc('news_posts_count')
            ->take(10)
            ->get();

        return Inertia::render('Frontend/Author/TopWriters', [
            'authors' => $authors,
        ]);
    }


}
