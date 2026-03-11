<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FallbackImage;

class FallbackImageController extends Controller
{
    public function index()
    {
        $fallback = FallbackImage::where('type', FallbackImage::NEWS_THUMBNAIL)->first();

        return inertia('Admin/FallbackImage/Index', [
            'fallback' => $fallback
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
        ]);

        $file = $request->file('image');
        $path = $file->store('fallbacks', 'public');

        // Delete old file if exists
        $existing = FallbackImage::where('type', FallbackImage::NEWS_THUMBNAIL)->first();
        if ($existing && Storage::disk('public')->exists($existing->path)) {
            Storage::disk('public')->delete($existing->path);
        }

        FallbackImage::updateOrCreate(
            ['type' => FallbackImage::NEWS_THUMBNAIL],
            ['path' => $path]
        );

        return back()->with('success', 'Fallback image updated successfully');
    }


    
}
