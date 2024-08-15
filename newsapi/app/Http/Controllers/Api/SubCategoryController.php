<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{

    public function index(Request $request)
{
    $categoryId = $request->query('category_id');

    if ($categoryId) {
        $subCategories = SubCategory::where('category_id', $categoryId)->get();
    } else {
        $subCategories = SubCategory::all();
    }

    return response()->json(['data' => $subCategories]);
}


    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subCategory = SubCategory::create($request->all());

        return response()->json(['success' => true, 'data' => $subCategory, 'message' => 'Sub-category created successfully.']);
    }

    public function show(SubCategory $subCategory)
    {
        return response()->json(['success' => true, 'data' => $subCategory, 'message' => 'Sub-category retrieved successfully.']);
    }

    public function update(Request $request, SubCategory $subCategory)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subCategory->update($request->all());

        return response()->json(['success' => true, 'data' => $subCategory, 'message' => 'Sub-category updated successfully.']);
    }

    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();

        return response()->json(['success' => true, 'message' => 'Sub-category deleted successfully.']);
    }
}

