<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Advertisement;
use App\Models\Category;
use App\Models\SubCategory;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdvertisementAssignmentController extends Controller
{
    /*
    public function index()
    {
        $ads = Advertisement::with(['categories','subCategories'])
            ->latest()
            ->get();

        return Inertia::render('Admin/Advertisements/Index', [
            'ads' => $ads
        ]);
    }
        */

    public function index(Request $request)
    {
        $ads = Advertisement::with(['categories','subCategories'])
            ->when($request->search, function ($query) use ($request) {
                $query->where('ad_name', 'like', '%' . $request->search . '%');
            })
            ->when($request->category, function ($query) use ($request) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('categories.id', $request->category);
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = Category::select('id','name')->get();

        return Inertia::render('Admin/Advertisements/Index', [
            'ads' => $ads,
            'categories' => $categories,
            'filters' => $request->only(['search','category'])
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

        return redirect()->route('admin.advertisements.index')->with('success','Advertisement created successfully');

    }

    public function edit(Advertisement $advertisement)
    {
        $advertisement->load(['categories','subCategories']);

        return Inertia::render('Admin/Advertisements/Edit', [
            'ad' => $advertisement,
            'categories' => Category::select('id','name')->get(),
            'subCategories' => SubCategory::select('id','name','category_id')->get(),
        ]);
    }

    public function update(Request $request, Advertisement $advertisement)
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

        $imagePath = $advertisement->ad_image;

        if ($request->hasFile('ad_image')) {

            // delete old image
            if ($advertisement->ad_image && Storage::disk('public')->exists($advertisement->ad_image)) {
                Storage::disk('public')->delete($advertisement->ad_image);
            }

            $imagePath = $request->file('ad_image')->store('ads','public');
        }

        $advertisement->update([
            'ad_name' => $request->ad_name,
            'ad_url' => $request->ad_url,
            'ad_image' => $imagePath,
            'ad_code' => $request->ad_code,
            'is_global' => $request->is_global ?? false,
            'status' => $request->status ?? true,
        ]);

        $advertisement->categories()->sync($request->categories ?? []);
        $advertisement->subCategories()->sync($request->sub_categories ?? []);

        return redirect()
            ->route('admin.advertisements.index')
            ->with('success','Advertisement updated successfully');
    }

    public function toggleStatus(Advertisement $advertisement)
    {
        $advertisement->update([
            'status' => !$advertisement->status
        ]);

        return back()->with('success','Advertisement status updated');
    }

    public function destroy(Advertisement $advertisement)
    {
        // delete image if exists
        if ($advertisement->ad_image && Storage::disk('public')->exists($advertisement->ad_image)) {
            Storage::disk('public')->delete($advertisement->ad_image);
        }

        $advertisement->delete();

        return back()->with('success', 'Advertisement deleted');
    }


}
