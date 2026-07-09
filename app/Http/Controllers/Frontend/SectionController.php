<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    /**
     * Fetch news for a specific category with limit
     */
    public function getCategoryNews(Request $request)
    {
        $request->validate([
            'category_slug' => 'required|string',
            'limit' => 'nullable|integer|min:1'
        ]);

        $limit = $request->input('limit', 5);
        $slug = $request->input('category_slug');

        $news = NewsPost::query()
            ->where('status', 'published')
            ->whereHas('categories', fn($q) => $q->where('slug', $slug))
            ->latest('published_at')
            ->take($limit)
            ->get();

        return response()->json([
            'category_slug' => $slug,
            'news' => $news,
        ]);
    }
}