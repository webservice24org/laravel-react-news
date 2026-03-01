<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomeSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeSectionController extends Controller
{
    public function index()
    {
        $sections = HomeSection::orderBy('order')->get();
        return Inertia::render('Admin/HomepageBuilder', [
            'sections' => $sections,
        ]);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'order' => 'required|array',
        ]);

        foreach ($request->order as $index => $id) {
            HomeSection::where('id', $id)->update(['order' => $index + 1]);
        }

        return back()->with('success', 'Homepage sections order updated successfully.');
    }
}