<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    /**
     * Display SEO Settings.
     */
    public function index()
    {
        return Inertia::render('Admin/Settings/SeoSettings', [
            'seo' => SeoSetting::first(),
        ]);
    }

    /**
     * Store or Update SEO Settings.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'site_name'           => 'nullable|string|max:255',
            'meta_title'          => 'nullable|string|max:255',
            'meta_description'    => 'nullable|string|max:500',
            'meta_keywords'       => 'nullable|string|max:500',

            'og_title'            => 'nullable|string|max:255',
            'og_description'      => 'nullable|string|max:500',
            'og_image'            => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'twitter_title'       => 'nullable|string|max:255',
            'twitter_description' => 'nullable|string|max:500',
            'twitter_image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',

            'index_site'          => 'required|boolean',
            'google_verification_code' => 'nullable|string|max:255',
            'bing_verification_code' => 'nullable|string|max:255',
            'copyright_credit' => 'nullable|string|max:255',
        ]);

        $seo = SeoSetting::first();

        // Upload OG Image
        if ($request->hasFile('og_image')) {

            if ($seo?->og_image && file_exists(storage_path('app/public/' . $seo->og_image))) {
                unlink(storage_path('app/public/' . $seo->og_image));
            }

            $validated['og_image'] = $request
                ->file('og_image')
                ->store('seo', 'public');
        } else {
            unset($validated['og_image']);
        }

        // Upload Twitter Image
        if ($request->hasFile('twitter_image')) {

            if ($seo?->twitter_image && file_exists(storage_path('app/public/' . $seo->twitter_image))) {
                unlink(storage_path('app/public/' . $seo->twitter_image));
            }

            $validated['twitter_image'] = $request
                ->file('twitter_image')
                ->store('seo', 'public');
        } else {
            unset($validated['twitter_image']);
        }

        SeoSetting::updateOrCreate(
            ['id' => 1],
            $validated
        );

        return back()->with(
            'success',
            'SEO settings updated successfully.'
        );
    }
}