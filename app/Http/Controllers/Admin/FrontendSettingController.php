<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FrontendSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FrontendSettingController extends Controller
{
    public function edit()
    {
        $setting = FrontendSetting::first();

        return Inertia::render(
            'Admin/Settings/FrontendSettings',
            [
                'setting' => $setting,
            ]
        );
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'sub_lead_title' => ['required', 'string', 'max:255'],
            'latest_news_title' => ['required', 'string', 'max:255'],
            'most_viewed_title' => ['required', 'string', 'max:255'],
            'related_news_title' => ['required', 'string', 'max:255'],

            'previous_news_text' => ['required', 'string', 'max:255'],
            'next_news_text' => ['required', 'string', 'max:255'],
        ]);

        FrontendSetting::updateOrCreate(
            ['id' => 1],
            $validated
        );

        return back()->with(
            'success',
            'Frontend settings updated successfully.'
        );
    }
}