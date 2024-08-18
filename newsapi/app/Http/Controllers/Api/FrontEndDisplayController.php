<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
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
                ->without('category', 'subcategories', 'tags', 'seo') // Disable eager loading
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





}
