<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
     public function index()
    {
        // Get all categories
        $categories = Category::orderBy('order_no')->get();

        return Inertia::render('Admin/Category/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
            'order_no' => ['nullable', 'integer'],
        ]);

        // If slug not provided, generate from name
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $category = Category::create($validated);

        return redirect()->back()->with('success', 'Category created successfully!');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'boolean'],
            'order_no' => ['nullable', 'integer'],
        ]);

        // Auto-generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    public function toggleStatus(Category $category)
    {
        $category->update([
            'status' => ! $category->status,
        ]);

        return back()->with('success', 'Category status updated');
    }


    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully!');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:categories,id'],
        ]);

        Category::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Categories deleted successfully');
    }



}