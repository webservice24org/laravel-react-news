<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::all();
        return response()->json(['success' => true, 'data' => $categories, 'message' => 'Categories retrieved successfully.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category = Category::create($request->all());

        return response()->json(['success' => true, 'data' => $category, 'message' => 'Category created successfully.']);
    }

    public function show(Category $category)
    {
        return response()->json(['success' => true, 'data' => $category, 'message' => 'Category retrieved successfully.']);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'category_name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $category->update($request->all());

        return response()->json(['success' => true, 'data' => $category, 'message' => 'Category updated successfully.']);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json(['success' => true, 'message' => 'Category deleted successfully.']);
    }

    public function getCategoryWithSubCategories($categoryId)
    {
        $category = Category::with('subCategories')->find($categoryId);
    
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    
        $response = [
            'categoryName' => $category->category_name,
            'subCategories' => $category->subCategories->map(function ($subCategory) {
                return [
                    'id' => $subCategory->id,
                    'name' => $subCategory->sub_category_name
                ];
            })
        ];
    
        return response()->json($response);
    }
    



}
