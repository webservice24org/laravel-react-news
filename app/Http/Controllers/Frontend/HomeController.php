<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\NewsPost;
use App\Models\HomeSection;
use Inertia\Inertia;
use App\Models\Menu;

class HomeController extends Controller
{
    public function index()
    {
        // Lead and Sub-Lead
        $leadNews    = $this->getLeadNews();
        $subLeadNews = $this->getSubLeadNews();

        // Fetch homepage sections ordered by 'order'
        $sectionsConfig = HomeSection::with(['category'])
                        ->where('status', true)
                        ->orderBy('order')
                        ->get();

        $sections = [];

        foreach ($sectionsConfig as $section) {
            $news = $this->getCategoryNews(
                $section->category_slug,
                $section->limit
            );

            $sections = $sectionsConfig->map(function ($section) {

                return [
                    'id' => $section->id,
                    'type' => $section->type,
                    'category_slug' => $section->category_slug,
                    'category' => $section->category,
                    'news' => $this->getCategoryNews(
                        $section->category_slug,
                        $section->limit
                    ),
                ];
            });
        }

         // 🔹 MENU
        
        //dd($menus);

        return Inertia::render('Frontend/Home', [
            'leadNews'    => $leadNews,
            'subLeadNews' => $subLeadNews,
            'sections'    => $sections,
            //'menus'       => $menus,
        ]);
        
    }

    private function getLeadNews()
    {
        return NewsPost::query()
            ->where('status', 'published')
            ->where('is_lead', true)
            ->latest()
            ->take(10)
            ->get();
    }

    private function getSubLeadNews()
    {
        return NewsPost::query()
            ->where('status', 'published')
            ->where('is_sub_lead', true)
            ->latest()
            ->take(5)
            ->get();
    }

    private function getCategoryNews(string $slug, int $limit = 5)
    {
        return NewsPost::query()
            ->with('categories:id,name,slug')
            ->where('status', 'published')
            ->whereHas('categories', fn($q) => $q->where('slug', $slug))
            ->latest()
            ->take($limit)
            ->get();
    }

    
}