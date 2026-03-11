<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\SubCategory;
use Inertia\Inertia;

class AdvertisementAssignmentController extends Controller
{
    public function index()
    {
        $ads = Advertisement::with(['categories','subCategories'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Advertisements/Index', [
            'ads' => $ads
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Advertisements/Create', [
            'categories' => Category::select('id','name')->get(),
            'subCategories' => SubCategory::select('id','name','category_id')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ad_name' => 'required|string',
            'ad_url' => 'nullable|url',
            'ad_image' => 'nullable|image|max:2048',
            'ad_code' => 'nullable|string',
            'is_global' => 'boolean',
            'status' => 'boolean',

            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id',

            'sub_categories' => 'nullable|array',
            'sub_categories.*' => 'exists:sub_categories,id',
        ]);

        $imagePath = null;

        if ($request->hasFile('ad_image')) {
            $imagePath = $request->file('ad_image')->store('ads', 'public');
        }

        $ad = Advertisement::create([
            'ad_name' => $request->ad_name,
            'ad_url' => $request->ad_url,
            'ad_image' => $imagePath,
            'ad_code' => $request->ad_code,
            'is_global' => $request->is_global ?? false,
            'status' => $request->status ?? true,
        ]);

        $ad->categories()->sync($request->categories ?? []);
        $ad->subCategories()->sync($request->sub_categories ?? []);

        return back()->with('success','Advertisement created successfully');
    }

    public function destroy(Advertisement $advertisement)
    {
        $advertisement->delete();

        return back()->with('success','Advertisement deleted');
    }
}
