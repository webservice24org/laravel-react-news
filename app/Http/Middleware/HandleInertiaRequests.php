<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Menu;
use App\Models\NewsPost;
use App\Models\Logo;
use App\Models\SocialConnection;

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

            // ✅ Menus
            'menus' => Menu::with('childrenRecursive')
                ->whereNull('parent_id')
                ->orderBy('order')
                ->get(),

            // ✅ Latest News
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

            // ✅ Logos (GLOBAL)
            'logos' => fn () => Logo::all()->keyBy('type')->map(fn ($logo) => [
            'path' => asset('storage/' . $logo->path),
            'alt' => $logo->alt,
            ]),

            // ✅ Social Links (GLOBAL)
            'socials' => fn () => optional(SocialConnection::first(), function ($s) {
                return [
                    'facebook' => $s->facebook_url,
                    'twitter' => $s->twitter_url,
                    'instagram' => $s->instagram_url,
                    'youtube' => $s->youtube_url,
                    'tiktok' => $s->tiktok_url,
                    'pinterest' => $s->pinterest_url,
                    'whatsapp' => $s->whatsapp_url,
                ];
            }),
        ];
    }

}
