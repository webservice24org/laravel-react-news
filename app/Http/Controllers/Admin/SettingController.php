<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting;
use Inertia\Inertia;

class SettingController extends Controller
{
     public function index()
    {
        $setting = Setting::first();

        return Inertia::render('Admin/Settings/Index', [
            'setting' => $setting
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'website_name' => ['required','string','max:255'],
            'tagline' => ['nullable','string','max:255'],
            'meta_tags' => ['nullable','string'],
            'meta_description' => ['nullable','string'],
            'copyright_credit' => ['nullable','string','max:255'],
        ]);

        Setting::updateOrCreate(
            ['id' => 1],
            $data
        );

        return back()->with('success','Settings saved successfully');
    }
}
