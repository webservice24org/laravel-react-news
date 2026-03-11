<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AnalyticsConfig;
use Inertia\Inertia;

class AnalyticsConfigController extends Controller
{
    public function index()
    {
        $config = AnalyticsConfig::first();

        return Inertia::render('Admin/AnalyticsConfig/Index', [
            'config' => $config
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => ['nullable','string','max:255'],
            'service_account_json' => ['nullable','string'],
        ]);

        AnalyticsConfig::updateOrCreate(
            ['id' => 1],
            $data
        );

        return back()->with('success','Analytics configuration saved successfully');
    }
}
