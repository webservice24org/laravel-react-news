<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Search Result Page
     */
    public function index(Request $request)
    {
        $search = trim($request->get('q', ''));
        
        $news = NewsPost::query()
            ->with([
                'author:id,name',
                'categories:id,name,slug',
                'tags:id,name',
            ])
            ->where('status', 'published')

            ->when($search, function ($query) use ($search) {

                $query->where(function ($query) use ($search) {

                    $query->where('news_title', 'LIKE', "%{$search}%")
                        ->orWhere('hanger_title', 'LIKE', "%{$search}%")
                        ->orWhere('news_description', 'LIKE', "%{$search}%")
                        ->orWhere('meta_title', 'LIKE', "%{$search}%")
                        ->orWhere('meta_description', 'LIKE', "%{$search}%")

                        ->orWhereHas('categories', function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%");
                        })

                        ->orWhereHas('tags', function ($q) use ($search) {
                            $q->where('name', 'LIKE', "%{$search}%");
                        });

                });

            })

            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Frontend/Search/Search', [
            'search' => $search,
            'news' => $news,

            'latestNews' => NewsPost::query()
            ->where('status', 'published')
            ->latest('published_at')
            ->take(6)
            ->get(),

            'mostViewedNews' => NewsPost::query()
                ->where('status', 'published')
                ->orderByDesc('view_count')
                ->take(6)
                ->get(),
        ]);
    }

    /**
     * Live Search Suggestions
     */
    public function suggestions(Request $request)
    {
        $search = trim($request->get('q', ''));

        if (strlen($search) < 2) {
            return response()->json([]);
        }

        $news = NewsPost::query()
            ->where('status', true)

            ->where(function ($query) use ($search) {

                $query->where('news_title', 'LIKE', "%{$search}%")
                    ->orWhere('hanger_title', 'LIKE', "%{$search}%")
                    ->orWhere('news_description', 'LIKE', "%{$search}%")

                    ->orWhereHas('categories', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%");
                    })

                    ->orWhereHas('tags', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%");
                    });

            })

            ->latest('published_at')

            ->take(8)

            ->get([
                'id',
                'slug',
                'news_title',
                'news_thumbnail',
                'published_at',
            ])

            ->map(function ($item) {

                return [
                    'id' => $item->id,
                    'title' => $item->news_title,
                    'slug' => $item->slug,
                    'image' => $item->news_thumbnail
                        ? asset('storage/' . $item->news_thumbnail)
                        : asset('images/fallback-news.jpg'),
                ];

            });

        return response()->json($news);
    }
}