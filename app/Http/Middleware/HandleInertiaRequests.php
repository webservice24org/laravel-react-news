<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Menu;
use App\Models\NewsPost;
use App\Models\Logo;
use App\Models\OfficeInfo;
use App\Models\Page;
use App\Models\Setting;
use App\Models\FrontendSetting;
use App\Models\Advertisement;
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

            // ✅ Office Info (GLOBAL)
            'officeInfo' => fn () => optional(OfficeInfo::first(), function ($info) {
                return [
                    'office_address' => $info->office_address,
                    'mobile' => $info->mobile,
                    'phone' => $info->phone,
                    'email' => $info->email,
                    'editor_title' => $info->editor_title,
                    'editor_name' => $info->editor_name,
                ];
            }),

            // ✅ Pages (GLOBAL)
            'pages' => fn () => Page::where('status', true)
                ->get()
                ->map(fn ($page) => [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,

                ]),

            // ✅ Settings (GLOBAL)
            'settings' => fn () => optional(Setting::first(), function ($setting) {
                return [
                    'website_name' => $setting->website_name,
                    'tagline' => $setting->tagline,
                    'meta_tags' => $setting->meta_tags,
                    'meta_description' => $setting->meta_description,
                    'copyright_credit' => $setting->copyright_credit,
                ];
            }),

            // ✅ Frontend Settings (GLOBAL)
            'frontendSettings' => fn () => optional(FrontendSetting::first(), function ($setting) {
                return [
                    'sub_lead_title' => $setting->sub_lead_title,
                    'latest_news_title' => $setting->latest_news_title,
                    'most_viewed_title' => $setting->most_viewed_title,
                    'related_news_title' => $setting->related_news_title,
                    'previous_news_text' => $setting->previous_news_text,
                    'next_news_text' => $setting->next_news_text,
                ];
            }),

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

            // ✅ Advertisements (GLOBAL)
            'advertisements' => fn () => Advertisement::with(['categories', 'subCategories'])
                ->where('status', true)
                ->get()
                ->map(fn ($ad) => [
                    'id' => $ad->id,
                    'ad_name' => $ad->ad_name,
                    'ad_image' => $ad->ad_image ? asset('storage/' . $ad->ad_image) : null,
                    'ad_url' => $ad->ad_url,
                    'ad_code' => $ad->ad_code,
                    'is_global' => $ad->is_global,
                    'categories' => $ad->categories->map(fn ($category) => [
                        'id' => $category->id,
                        'name' => $category->name,
                    ]),
                    'subCategories' => $ad->subCategories->map(fn ($subCategory) => [
                        'id' => $subCategory->id,
                        'name' => $subCategory->name,
                    ]),
                ]),
        ];
    }

}
