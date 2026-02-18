<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\District;
use App\Models\Division;
use Illuminate\Support\Str;

class DistrictController extends Controller
{
    /**
     * Display a listing of districts.
     */
    public function index()
    {
        // Load districts with division relationship
        $districts = District::with('division')->orderBy('order_no')->get();

        // Load divisions for dropdowns in create/edit modals
        $divisions = Division::where('status', true)->orderBy('name')->get();

        return Inertia::render('Admin/District/Index', [
            'districts' => $districts,
            'divisions' => $divisions,
        ]);
    }

    /**
     * Store a newly created district.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:districts',
            'division_id' => 'required|exists:divisions,id',
            'order_no' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);  
        $validated['status'] = $validated['status'] ?? true;

        District::create($validated);

        return redirect()->back()->with('success', 'District created successfully!');
    }

    /**
     * Update the specified district.
     */
    public function update(Request $request, District $district)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:districts',
            'division_id' => 'required|exists:divisions,id',
            'order_no' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);  
        $validated['status'] = $validated['status'] ?? true;

        $district->update($validated);

        return redirect()->back()->with('success', 'District updated successfully!');
    }

    /**
     * Delete a single district.
     */
    public function destroy(District $district)
    {
        $district->delete();

        return redirect()->back()->with('success', 'District deleted successfully!');
    }

    /**
     * Toggle the status of a district.
     */
    public function toggleStatus(District $district, Request $request)
    {
        $status = $request->input('status');
        $district->update(['status' => $status]);

        return redirect()->back()->with('success', 'District status updated successfully!');
    }

    /**
     * Bulk delete districts.
     */
    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids', []);
        if (!empty($ids)) {
            District::whereIn('id', $ids)->delete();
        }

        return redirect()->back()->with('success', 'Selected districts deleted successfully!');
    }
}
