<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/SubCategory/Index', [
            'subCategories' => SubCategory::with('category')
                ->orderBy('order_no')
                ->get(),
            'categories' => Category::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name'        => ['required', 'string', 'max:255'],
            'status'      => ['boolean'],
            'order_no'    => ['nullable', 'integer'],
        ]);

        $data['slug'] = Str::slug($data['name']);

        SubCategory::create($data);

        return back()->with('success', 'Sub-category created');
    }


    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:sub_categories,slug,' . $subCategory->id],
            'status' => ['required', 'boolean'],
            'order_no' => ['nullable', 'integer'],
        ]);

        $subCategory->update($validated);

        return redirect()->back()->with('success', 'Sub Category updated');
    }


    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();

        return back()->with('success', 'Sub-category deleted');
    }

    // SubCategoryController
    public function toggleStatus(SubCategory $subCategory)
    {
        $subCategory->status = !$subCategory->status;
        $subCategory->save();

        return redirect()->back()->with('success', 'Status updated');
    }


    public function bulkDestroy(Request $request)
    {
        $ids = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:sub_categories,id',
        ])['ids'];

        SubCategory::whereIn('id', $ids)->delete();

        return back()->with('success', count($ids) . ' sub categories deleted');
    }

}
