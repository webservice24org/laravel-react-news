<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController
{
    public function image(Request $request)
    {
        $request->validate([
            'file' => ['required', 'image', 'max:5120'],
        ]);

        $path = $request->file('file')->store('news-images', 'public');

        return response()->json([
            'url' => Storage::disk('public')->url($path),
        ]);
    }

    public function destroyImage(Request $request)
    {
        $request->validate([
            'src' => ['required', 'string'],
        ]);

        $src = $request->input('src');

        // Accept:
        // - full url: http://.../storage/news-images/xxx.jpg
        // - relative storage url: /storage/news-images/xxx.jpg
        // - relative disk path: news-images/xxx.jpg

        $path = $src;

        // if it's a URL, extract path
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            $path = parse_url($path, PHP_URL_PATH) ?? '';
        }

        // remove leading /storage/
        $path = ltrim($path, '/');
        if (str_starts_with($path, 'storage/')) {
            $path = substr($path, strlen('storage/'));
        }

        // SECURITY: only allow deleting inside news-images/
        if (!str_starts_with($path, 'news-images/')) {
            return response()->json([
                'message' => 'Invalid path.',
            ], 422);
        }

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        return response()->json([
            'ok' => true,
        ]);
    }
}