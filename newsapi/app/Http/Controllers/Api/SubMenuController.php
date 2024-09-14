<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\SubMenu;
use Illuminate\Http\Request;

class SubMenuController extends Controller
{
    public function index()
    {
        $subMenus = SubMenu::with('menu')->get(); // Fetch sub-menus with their parent menus
        return response()->json([
            'message' => 'Menus retrieved successfully.',
            'data' => $subMenus
        ], 200); // 200 OK status
    }

    // Show the form for creating a new resource
    public function create()
    {
        // This can be used to return a view for creating a sub-menu
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|string|max:255',
            'menu_id' => 'required|exists:menus,id',
            'position' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ]);

        $subMenu = SubMenu::create($validatedData);

        return response()->json([
            'message' => 'Sub-menu created successfully.',
            'data' => $subMenu
        ], 201); // 201 Created status
    }

    // Display the specified resource
    public function show(SubMenu $subMenu)
    {
        return response()->json($subMenu);
    }

    // Show the form for editing the specified resource
    public function edit(SubMenu $subMenu)
    {
        // This can be used to return a view for editing a sub-menu
    }

    // Update the specified resource in storage
    public function update(Request $request, SubMenu $subMenu)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'link' => 'required|string|max:255',
            'menu_id' => 'required|exists:menus,id',
            'position' => 'nullable|integer',
            'status' => 'required|in:active,inactive',
        ]);

        $subMenu->update($validatedData);

        return response()->json([
            'message' => 'Sub-menu updated successfully.',
            'data' => $subMenu
        ]);
    }

    // Remove the specified resource from storage
    public function destroy(SubMenu $subMenu)
    {
        $subMenu->delete();

        return response()->json([
            'message' => 'Sub-menu deleted successfully.'
        ]);
    }

    public function getSubMenusByMenu(Menu $menu)
    {
        // Load the subMenus relationship
        $subMenus = $menu->subMenus()->get();

        return response()->json([
            'success' => true,
            'menu' => $menu->name,
            'sub_menus' => $subMenus,
        ]);
    }
}
