<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;

class HomeSectionController extends Controller
{
    public function index()
    {
        $sections = HomeSection::orderBy('order')->get();

        $categories = Category::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('Admin/HomepageBuilder', [
            'sections' => $sections,
            'categories' => $categories,
        ]);
    }

    /**
     * Store new homepage section
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'category_slug' => 'required|string|max:255',
            'limit' => 'required|integer|min:1|max:50',
        ]);

        // Get next order number
        $maxOrder = HomeSection::max('order') ?? 0;

        HomeSection::create([
            'type' => $validated['type'],
            'category_slug' => $validated['category_slug'],
            'limit' => $validated['limit'],
            'status' => true,
            'order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Section created successfully.');
    }



    /**
     * Update existing homepage section
     */
    public function update(Request $request, HomeSection $homepage_builder)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:255',
            'category_slug' => 'required|string|max:255',
            'limit' => 'required|integer|min:1|max:50',
        ]);

        $homepage_builder->update($validated);

        return back()->with('success', 'Section updated successfully.');
    }

    /**
     * Delete homepage section
     */
    public function destroy(HomeSection $homepage_builder)
    {
        $homepage_builder->delete();

        // Optional: Reorder remaining sections
        $sections = HomeSection::orderBy('order')->get();
        foreach ($sections as $index => $section) {
            $section->update(['order' => $index + 1]);
        }

        return back()->with('success', 'Section deleted successfully.');
    }

    /**
     * Update order (already working)
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
        ]);

        foreach ($request->order as $index => $id) {
            HomeSection::where('id', $id)
                ->update(['order' => $index + 1]);
        }

        return back()->with('success', 'Homepage sections order updated successfully.');
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $section = HomeSection::findOrFail($id);
        $section->status = $request->status;
        $section->save();

        return back()->with('success', 'Section status updated successfully.');
    }

}