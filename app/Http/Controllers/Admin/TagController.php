<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of tags.
     */
    public function index()
    {
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Admin/Tag/Index', [
            'tags' => $tags,
        ]);
    }

    /**
     * Store a newly created tag.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tags,slug',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Tag::create($validated);

        return back()->with('success', 'Tag created successfully.');
    }

    /**
     * Update the specified tag.
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:tags,slug,' . $tag->id,
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $tag->update($validated);

        return back()->with('success', 'Tag updated successfully.');
    }

    /**
     * Remove the specified tag.
     */
    public function destroy(Tag $tag)
    {
        $tag->delete();

        return back()->with('success', 'Tag deleted successfully.');
    }

    /**
     * Bulk delete tags.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tags,id',
        ]);

        Tag::whereIn('id', $request->ids)->delete();

        return redirect()
            ->route('admin.tags.index')
            ->with('success', 'Selected tags deleted successfully.');
    }

    

}
