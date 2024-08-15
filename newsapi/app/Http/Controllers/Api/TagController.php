<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::all();
        return response()->json(['success' => true, 'data' => $tags, 'message' => 'Tags retrieved successfully.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tag_name' => 'required|string|max:255',
        ]);

        $tag = Tag::create($request->all());

        return response()->json(['success' => true, 'data' => $tag, 'message' => 'Tag created successfully.']);
    }

    public function show(Tag $tag)
    {
        return response()->json(['success' => true, 'data' => $tag, 'message' => 'Tag retrieved successfully.']);
    }

    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'tag_name' => 'required|string|max:255',
        ]);

        $tag->update($request->all());

        return response()->json(['success' => true, 'data' => $tag, 'message' => 'Tag updated successfully.']);
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return response()->json(['success' => true, 'message' => 'Tag deleted successfully.']);
    }
}
