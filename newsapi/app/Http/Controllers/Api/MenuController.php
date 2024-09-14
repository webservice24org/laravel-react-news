<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    // Display a listing of the resource (GET /menu)
    public function index(): JsonResponse
    {
        $menus = Menu::all(); // Fetch all menu items

        return response()->json([
            'message' => 'Menus retrieved successfully.',
            'data' => $menus
        ], 200); // 200 OK status
    }

    // Store a newly created resource in storage (POST /menu)
    public function store(Request $request): JsonResponse
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'link' => 'required|string|max:255',
        'status' => 'required|in:active,inactive', // Validate the status field
        'position' => 'nullable|integer',
    ]);

    $menu = Menu::create($validatedData); // Create menu with validated data

    return response()->json([
        'message' => 'Menu created successfully.',
        'data' => $menu
    ], 201); // Return 201 status
}

    // Display the specified resource (GET /menu/{id})
    public function show($id): JsonResponse
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu not found.',
                'error' => 'Invalid Menu ID'
            ], 404); // 404 Not Found status
        }

        return response()->json([
            'message' => 'Menu retrieved successfully.',
            'data' => $menu
        ], 200); // 200 OK status
    }

    // Update the specified resource in storage (PUT/PATCH /menu/{id})
    public function update(Request $request, $id): JsonResponse
{
    $menu = Menu::find($id);

    if (!$menu) {
        return response()->json([
            'message' => 'Menu not found.',
            'error' => 'Invalid Menu ID'
        ], 404); // 404 Not Found status
    }

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'link' => 'required|string|max:255',
        'status' => 'required|in:active,inactive', // Validate the status field
        'position' => 'nullable|integer',
    ]);

    $menu->update($validatedData);

    return response()->json([
        'message' => 'Menu updated successfully.',
        'data' => $menu
    ], 200); // 200 OK status
}

    // Remove the specified resource from storage (DELETE /menu/{id})
    public function destroy($id): JsonResponse
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'message' => 'Menu not found.',
                'error' => 'Invalid Menu ID'
            ], 404); // 404 Not Found status
        }

        $menu->delete();

        return response()->json([
            'message' => 'Menu deleted successfully.'
        ], 200); // 200 OK status
    }
}
