<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostSeo;
use App\Models\PostSubcategory;
use App\Models\PostTag;
use App\Models\SubCategory;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Log;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        return response()->json(['success' => true, 'data' => $posts, 'message' => 'Posts retrieved successfully.']);
    }
    public function postList()
    {
        $posts = Post::select('id','post_title', 'post_thumbnail', 'reporter_name')->get();
        return response()->json(['success' => true, 'data' => $posts, 'message' => 'Posts retrieved successfully.']);
    }


    public function store(Request $request)
    {
        $request->validate([
            'post_title' => 'required|string|max:255',
            'post_details' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'division_id' => 'nullable|integer|exists:divisions,id',
            'district_id' => 'nullable|integer|exists:districts,id',
            'post_slug' => 'nullable|string|max:255|unique:posts,post_slug',
            'sub_category_ids' => 'nullable|array',
            'tags' => 'nullable|array',
            'tags.*' => 'string', 
            'seo_title' => 'nullable|string',
            'seo_descp' => 'nullable|string',
            'post_thumbnail' => 'nullable|image|mimes:jpeg,png,jpg',
            'thumbnail_alt' => 'nullable|string|max:255|unique:posts,thumbnail_alt',
        ]);

        $input = $request->except(['sub_category_ids', 'tags', 'category_id', 'seo_title', 'seo_descp']);

        if ($request->hasFile('post_thumbnail')) {
            $file = $request->file('post_thumbnail');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/post', $filename);
            $input['post_thumbnail'] = $filename;
        }

        if (empty($input['post_slug'])) {
            $input['post_slug'] = preg_replace('/\s+/u', '-', trim($input['post_title']));
        }
        if (empty($input['thumbnail_alt'])) {
            $input['thumbnail_alt'] = preg_replace('/\s+/u', '-', trim($input['post_title']));
        }

        DB::beginTransaction();
        try {
            $post = Post::create($input);

            PostCategory::create([
                'post_id' => $post->id,
                'category_id' => $request->category_id
            ]);

            if ($request->has('sub_category_ids')) {
                foreach ($request->sub_category_ids as $sub_category_id) {
                    PostSubcategory::create([
                        'post_id' => $post->id,
                        'sub_category_id' => $sub_category_id
                    ]);
                }
            }

            if ($request->has('tags')) {
                $tags = $request->input('tags');
                $tagIds = [];
                
                foreach ($tags as $tag) {
                    $tagName = is_array($tag) ? $tag['tag_name'] : $tag;
                    if (is_string($tagName)) {
                        $tagModel = Tag::firstOrCreate(['tag_name' => $tagName]);
                        $tagIds[] = $tagModel->id;
                    }
                }
                
                $post->tags()->sync($tagIds);
            }

            PostSeo::updateOrCreate(
                ['post_id' => $post->id],
                [
                    'seo_title' => $request->input('seo_title'),
                    'seo_descp' => $request->input('seo_descp')
                ]
            );

            DB::commit();
            return response()->json(['success' => true, 'data' => $post, 'message' => 'Post created successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Post creation failed. ' . $e->getMessage()], 500);
        }
    }


    public function show($id)
    {
        $post = Post::with(['category', 'subcategories', 'tags', 'seo'])->find($id);
        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found.'], 404);
        }
        return response()->json(['success' => true, 'data' => $post, 'message' => 'Post retrieved successfully.']);
    }
    

    public function updatePost(Request $request, $id)
    {
        $request->validate([
            'post_title' => 'required|string|max:255',
            'post_details' => 'required|string',
            'category_id' => 'required|integer|exists:categories,id',
            'user_id' => 'nullable|integer|exists:users,id',
            'division_id' => 'nullable|integer|exists:divisions,id',
            'district_id' => 'nullable|integer|exists:districts,id',
            'post_slug' => 'nullable|string|max:255|unique:posts,post_slug,' . $id,
            'sub_category_ids' => 'nullable|array',
            'sub_category_ids.*' => 'integer|exists:sub_categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'seo_title' => 'nullable|string',
            'seo_descp' => 'nullable|string',
            
        ]);

        $post = Post::findOrFail($id);
        $input = $request->except(['sub_category_ids', 'tags', 'category_id', 'seo_title', 'seo_descp']);

        if ($request->hasFile('post_thumbnail')) {
            $request->validate([
                'post_thumbnail' => 'image|mimes:jpeg,png,jpg|max:2048',
            ]);
        
            $file = $request->file('post_thumbnail');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/post', $filename);
        
            if ($post->post_thumbnail && Storage::exists('public/post/' . $post->post_thumbnail)) {
                $oldThumbnailPath = storage_path('app/public/post/' . $post->post_thumbnail);
                
                if (file_exists($oldThumbnailPath)) {
                    unlink($oldThumbnailPath);
                }
            }
        
            $input['post_thumbnail'] = $filename;
        } else {
            $input['post_thumbnail'] = $request->input('old_post_thumbnail');
        }
        
        $input['post_slug'] = !empty($input['post_slug']) 
            ? preg_replace('/\s+/u', '-', trim($input['post_slug']))
            : preg_replace('/\s+/u', '-', trim($request->input('post_title')));

        DB::beginTransaction();
        try {
            $post->fill($input);
            $post->save();

            if ($request->has('category_id')) {
                PostCategory::updateOrCreate(
                    ['post_id' => $post->id],
                    ['category_id' => $request->category_id]
                );
            } else {
                throw new \Exception('Category ID is required.');
            }

            if ($request->has('sub_category_ids')) {
                PostSubcategory::where('post_id', $post->id)->delete();
                foreach ($request->sub_category_ids as $sub_category_id) {
                    PostSubcategory::create([
                        'post_id' => $post->id,
                        'sub_category_id' => $sub_category_id
                    ]);
                }
            }

            if ($request->has('tags')) {
                $tags = $request->input('tags');
                $tagIds = [];
                
                foreach ($tags as $tagName) {
                    if (is_string($tagName)) {
                        $tag = Tag::firstOrCreate(['tag_name' => $tagName]);
                        $tagIds[] = $tag->id;
                    }
                }
                
                $post->tags()->sync($tagIds);
            }

            PostSeo::updateOrCreate(
                ['post_id' => $post->id],
                [
                    'seo_title' => $request->input('seo_title'),
                    'seo_descp' => $request->input('seo_descp')
                ]
            );

            DB::commit();
            return response()->json(['success' => true, 'data' => $post, 'message' => 'Post updated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Post update failed. ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $post = Post::find($id);
        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post not found.'], 404);
        }

        if ($post->post_thumbnail && Storage::exists('public/post/' . $post->post_thumbnail)) {
            $oldThumbnailPath = storage_path('app/public/post/' . $post->post_thumbnail);
            
            if (file_exists($oldThumbnailPath)) {
                unlink($oldThumbnailPath);
            }
        }
        $post->delete();

        return response()->json(['success' => true, 'message' => 'Post deleted successfully.']);
    }

}
