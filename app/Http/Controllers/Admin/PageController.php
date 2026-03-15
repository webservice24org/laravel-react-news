<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PageController extends Controller
{
     public function index()
    {
        $pages = Page::latest()->paginate(10);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Pages/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug',
            'content' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
            'status' => 'boolean',
            'layout' => 'required|in:default,sidebar-left,sidebar-right',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('pages', 'public');
        }

        Page::create([
            'title' => $request->title,
            'slug' => Str::slug($request->slug ?: $request->title),
            'content' => $request->content,
            'thumbnail' => $thumbnailPath,
            'status' => $request->status ?? true,
            'layout' => $request->layout,
        ]);

        return redirect()->route('admin.pages.index')->with('success', 'Page created successfully');
    }

    public function edit(Page $page)
    {
        return Inertia::render('Admin/Pages/EditPage', [
            'page' => $page,
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
            'thumbnail' => 'sometimes|nullable|image|max:2048',
            'status' => 'boolean',
            'layout' => 'required|in:default,sidebar-left,sidebar-right',
        ]);

        $thumbnailPath = $page->thumbnail;

        if ($request->hasFile('thumbnail')) {

            // delete old thumbnail
            if ($page->thumbnail && Storage::disk('public')->exists($page->thumbnail)) {
                Storage::disk('public')->delete($page->thumbnail);
            }

            $thumbnailPath = $request->file('thumbnail')->store('pages', 'public');
        }

        $page->update([
            'title' => $request->title,
            'slug' => Str::slug($request->slug ?: $request->title),
            'content' => $request->content,
            'thumbnail' => $thumbnailPath,
            'status' => $request->status ?? true,
            'layout' => $request->layout,
        ]);

        return back()->with('success', 'Page updated successfully');
    }

    public function destroy(Page $page)
    {
        if ($page->thumbnail && Storage::disk('public')->exists($page->thumbnail)) {
            Storage::disk('public')->delete($page->thumbnail);
        }

        $page->delete();

        return back()->with('success', 'Page deleted successfully');
    }


    public function show($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('status', true)
            ->firstOrFail();

        return Inertia::render('Frontend/Pages/Page', [
            'page' => $page
        ]);
    }

    


}
