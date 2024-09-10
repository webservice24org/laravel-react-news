<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VideoNews;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoNewsController extends Controller
{

    public function index()
    {
        $videoNews = VideoNews::all();
        return response()->json($videoNews);
    }

    public function show($id)
    {
        $video = VideoNews::findOrFail($id); 
        

        return response()->json([
            'video' => $video
        ]);
    }


    public function store(Request $request)
{
    $validated = $request->validate([
        'video_title' => 'required|string|max:255',
        'video_link' => 'required|string|max:255',
        'video_thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'isTop' => 'required|boolean',
    ]);
    if ($request->hasFile('video_thumbnail')) {
        $file = $request->file('video_thumbnail');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->storeAs('public/video', $filename);
        $validated['video_thumbnail'] = $filename;
    } else {
        $validated['video_thumbnail'] = null;
    }
    $videoNews = VideoNews::create($validated);

    return response()->json(['message' => 'Video News created successfully', 'data' => $videoNews], 201);
}


    public function updateVideo(Request $request, $id)
    {
        $videoNews = VideoNews::findOrFail($id);

        $validated = $request->validate([
            'video_title' => 'required|string|max:255',
            'video_link' => 'required|string',
            'video_thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'isTop' => 'boolean',
        ]);

        if ($request->hasFile('video_thumbnail')) {
            if ($videoNews->video_thumbnail) {
                Storage::delete('public/video/' . $videoNews->video_thumbnail);
            }
        
            $file = $request->file('video_thumbnail');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        
            $file->storeAs('public/video', $filename);
    
            $validated['video_thumbnail'] = $filename;
        }
        
        $videoNews->update($validated);

        return response()->json(['message' => 'Video News updated successfully', 'data' => $videoNews]);
    }


    public function destroy($id)
    {
        $videoNews = VideoNews::findOrFail($id);

        if ($videoNews->video_thumbnail) {
            Storage::delete('public/video/' . $videoNews->video_thumbnail);
        }
        $videoNews->delete();

        return response()->json(['message' => 'Video News deleted successfully']);
    }

    public function topVideos() {
        $topVideos = VideoNews::where('isTop', true) 
                              ->select('id', 'video_title', 'video_thumbnail', 'isTop')
                              ->orderBy('created_at', 'desc')
                              ->take(3)
                              ->get();
    
        return response()->json([
            'success' => true,
            'data' => $topVideos,
            'message' => 'Top videos retrieved successfully.'
        ]);
    }
    
}
