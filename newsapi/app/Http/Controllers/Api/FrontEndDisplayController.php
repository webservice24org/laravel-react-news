<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\PostSubcategory;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class FrontEndDisplayController extends Controller
{
    
    public function getLeadPost()
    {
        try {
            $post = Post::where('isLead', true)
                ->latest()
                ->select('id', 'post_title', 'post_details', 'post_thumbnail')
                ->without('category', 'subcategories', 'tags', 'seo') 
                ->first();
            
            return response()->json([
                'success' => true,
                'data' => $post,
                'message' => 'Lead post retrieved successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve lead post. ' . $e->getMessage()
            ], 500);
        }
    }

    public function getLeadPostsExceptLatest()
    {
        try {
            $latestLeadPost = Post::where('isLead', true)->latest()->first();
            if (!$latestLeadPost) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No lead posts found.'
                ]);
            }

            $latestLeadPostId = $latestLeadPost->id;
            $posts = Post::where('isLead', true)
                ->where('id', '<>', $latestLeadPostId)
                ->select('id', 'post_title', 'post_details', 'post_thumbnail')
                ->without('category', 'subcategories', 'tags', 'seo') 
                ->latest()
                ->take(6)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $posts,
                'message' => 'Lead posts retrieved successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve lead posts. ' . $e->getMessage()
            ], 500);
        }
    }


    public function getPostsByCategory($categoryId)
    {
        $category = Category::with('posts')->find($categoryId);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json([
            'categoryName' => $category->category_name, 
            'posts' => $category->posts,
        ]);
    }

    public function getPostsBySubCategories($categoryId, $subcatId)
    {
        $subCategory = SubCategory::where('category_id', $categoryId)
                        ->where('id', $subcatId)
                        ->firstOrFail(['id', 'sub_category_name']);
        
        $postIds = PostSubcategory::where('sub_category_id', $subcatId)->pluck('post_id');
        $posts = Post::whereIn('id', $postIds)->get();

        $categoryName = Category::findOrFail($categoryId)->category_name;

        return response()->json([
            'status' => 'success',
            'category' => [
                'id' => $categoryId,
                'name' => $categoryName,
            ],
            'subCategory' => [
                'id' => $subCategory->id,
                'name' => $subCategory->sub_category_name,
            ],
            'posts' => $posts,
        ]);
    }


}
