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

    public function getPostsByIndividualCategory(Request $request)
    {
        $categoryName = $request->query('category');

        $posts = Post::whereHas('categories', function ($query) use ($categoryName) {
            $query->where('category_name', $categoryName);
        })->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => $posts]);
    }

    public function getPostsByIndividualSubCategory(Request $request)
    {
        $subCategoryName = $request->query('subcategory');

        $posts = Post::whereHas('subcategories', function ($query) use ($subCategoryName) {
            $query->where('sub_category_name', $subCategoryName);
        })->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => $posts]);
    }

    public function getLatestPosts()
    {
        return Post::select('id', 'post_title', 'post_thumbnail') 
                ->without('category', 'subcategories', 'tags', 'seo') 
                ->latest() 
                ->take(6) 
                ->get(); 
    }
    public function mostViewedPosts()
    {
        return Post::select('id', 'post_title', 'post_thumbnail', 'view_count')
                    ->without('category', 'subcategories', 'tags', 'seo')
                    ->orderBy('view_count', 'desc') 
                    ->take(6)
                    ->get(); 
    }


    public function getDivisionWiseNews($divisionId)
    {
        $news = Post::select('posts.id', 'posts.post_title', 'posts.post_details', 'posts.division_id', 'posts.post_thumbnail', 'divisions.division_name')
            ->join('divisions', 'posts.division_id', '=', 'divisions.id')
            ->without(['category', 'subcategories', 'tags', 'seo']) 
            ->where('posts.division_id', $divisionId)
            ->orderBy('posts.created_at', 'desc') 
            ->get();

        if ($news->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No news found for this division.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'division_id' => $divisionId,
            'news' => $news
        ], 200);
    }

    
    public function getDistrictWiseNews($districtId)
    {
        $news = Post::select('posts.id', 'posts.post_title', 'posts.post_details', 'posts.district_id', 'posts.post_thumbnail', 'districts.district_name', 'divisions.division_name', 'divisions.id as division_id')
            ->join('districts', 'posts.district_id', '=', 'districts.id')
            ->join('divisions', 'districts.division_id', '=', 'divisions.id')
            ->without(['category', 'subcategories', 'tags', 'seo']) 
            ->where('posts.district_id', $districtId)
            ->orderBy('posts.created_at', 'desc')
            ->get();

        if ($news->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No news found for this district.'
            ], 404);
        }

        $firstPost = $news->first();

        return response()->json([
            'success' => true,
            'district_id' => $districtId,
            'district_name' => $firstPost->district_name,
            'division_id' => $firstPost->division_id,
            'division_name' => $firstPost->division_name,
            'news' => $news
        ], 200);
    }



}
