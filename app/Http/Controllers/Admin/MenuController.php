<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    // -----------------------------
    // Show Menu Maker Page
    // -----------------------------
    public function index()
    {
        $menus = Menu::whereNull('parent_id')
            ->with('childrenRecursive')
            ->orderBy('order')
            ->get();

        // Convert nested Eloquent collections to arrays
        $menus = $menus->map(function ($menu) {
            return $this->serializeMenu($menu);
        });

        return Inertia::render('Admin/MenuMaker', [
            'menus' => $menus,
            'categories' => Category::where('status', true)
                ->orderBy('order_no')
                ->get(['id','name','slug']),
            'subcategories' => SubCategory::where('status', true)
                ->orderBy('order_no')
                ->get(['id','name','slug','category_id']),
        ]);
    }

    // Recursive serialization
    private function serializeMenu($menu)
    {
        return [
            'id' => $menu->id,
            'title' => $menu->title,
            'url' => $menu->url,
            'parent_id' => $menu->parent_id,
            'childrenRecursive' => $menu->childrenRecursive->map(fn($child) => $this->serializeMenu($child))->toArray()
        ];
    }

    // -----------------------------
    // Store Menu Item
    // -----------------------------
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:category,subcategory,custom',
            'title' => 'nullable|string|max:255',
            'url' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'parent_id' => 'nullable|exists:menus,id',
        ]);

        // -----------------------------
        // Auto-fill title & url
        // -----------------------------
        if ($request->type === 'category' && $request->category_id) {
            $category = Category::find($request->category_id);
            $title = $category->name;
            $url = route('category.show', $category->slug);
        } elseif ($request->type === 'subcategory' && $request->sub_category_id) {
            $sub = SubCategory::find($request->sub_category_id);
            $category = Category::find($sub->category_id); // parent category for URL
            $title = $sub->name;
            $url = route('subcategory.show', [
                'categorySlug' => $category->slug,
                'subSlug' => $sub->slug
            ]);
        } else {
            // Custom Link
            $title = $request->title;
            $url = $request->url;
        }

        // -----------------------------
        // Save Menu
        // -----------------------------
        Menu::create([
            'type' => $request->type,
            'title' => $title,
            'url' => $url,
            'category_id' => $request->type === 'category' ? $request->category_id : null,
            'sub_category_id' => $request->type === 'subcategory' ? $request->sub_category_id : null,
            'parent_id' => $request->parent_id,
        ]);

        return redirect()->back()->with('success', 'Menu item added!');
    }

    // -----------------------------
    // Update Menu Order
    // -----------------------------
    public function order(Request $request)
    {
        foreach ($request->order ?? [] as $index => $item) {

            Menu::where('id', $item['id'])->update([
                'parent_id' => $item['parent_id'],
                'order' => $index
            ]);

        }

        return back()->with('success', 'Menu order updated!');
    }

    public function destroy($id)
    {
        $menu = Menu::findOrFail($id);

        $this->deleteChildren($menu);

        return redirect()->back()->with('success', 'Menu deleted successfully');
    }

    private function deleteChildren($menu)
    {
        foreach ($menu->childrenRecursive as $child) {
            $this->deleteChildren($child);
        }

        $menu->delete();
    }


}