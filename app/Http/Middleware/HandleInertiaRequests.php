<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Menu;
use App\Models\NewsPost;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
   public function share(Request $request): array
    {
        return [
            ...parent::share($request),

            'name' => config('app.name'),

            'auth' => [
                'user' => $request->user()
                    ? $request->user()->load('profile')
                    : null,
            ],

            'sidebarOpen' =>
                ! $request->hasCookie('sidebar_state') ||
                $request->cookie('sidebar_state') === 'true',

            // ✅ Global Menu
            'menus' => Menu::with('childrenRecursive')
                ->whereNull('parent_id')
                ->orderBy('order')
                ->get(),

            'latestNews' => fn () =>
            NewsPost::latest()
                ->take(5)
                ->get()
                ->map(fn ($post) => [
                    'id' => $post->id,
                    'news_title' => $post->news_title,
                    'slug' => $post->slug,
                    'news_thumbnail' => $post->news_thumbnail,
                    'created_at' => $post->created_at,
                ]),
                ];
    }

}
