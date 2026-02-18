<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Union;
use App\Models\Upazila;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\District;
use App\Models\Division;

class UnionController extends Controller
{
    /**
     * Display a listing of unions.
     */
    public function index()
    {
        // Load unions with upazila and its district
        $unions = Union::with([
            'upazila:id,name,district_id',
            'upazila.district:id,name,division_id',
        ])->orderBy('order_no')->get();

        // Active upazilas for create/edit dropdown
        $upazilas = Upazila::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'district_id']);

        // Active districts for cascading dropdown
        $districts = District::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'division_id']);

        // Active divisions for cascading dropdown
        $divisions = Division::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Union/Index', [
            'unions' => $unions,
            'upazilas' => $upazilas,
            'districts' => $districts,
            'divisions' => $divisions,
        ]);
    }


    /**
     * Store a newly created union.
     */
    public function store(Request $request)
    {
        $request->validate([
            'upazila_id' => 'required|exists:upazilas,id',
            'name'       => 'required|string|max:255',
            'slug'       => 'nullable|string|max:255|unique:unions,slug',
            'order_no'   => 'nullable|integer',
            'status'      => ['boolean'],
        ]);
        // Auto-generate slug if not provided
        if (!$request->filled('slug')) {
            $request->merge(['slug' => Str::slug($request->input('name'))]);
        }

        Union::create($request->all());

        return back()->with('success', 'Union created successfully.');
    }

    /**
     * Update the specified union.
     */
    public function update(Request $request, Union $union)
    {
        $request->validate([
            'upazila_id' => 'required|exists:upazilas,id',
            'name'       => 'required|string|max:255',
            'slug'       => 'nullable|string|max:255|unique:unions,slug,' . $union->id,
            'order_no'   => 'nullable|integer',
            'status'      => ['boolean'],
        ]);

        // Auto-generate slug if not provided
        if (!$request->filled('slug')) {
            $request->merge(['slug' => Str::slug($request->input('name'))]);
        }

        $union->update($request->all());

        return back()->with('success', 'Union updated successfully.');
    }

    /**
     * Remove the specified union.
     */
    public function destroy(Union $union)
    {
        $union->delete();
        return back()->with('success', 'Union deleted successfully.');
    }

    /**
     * Toggle union status.
     */
    public function toggleStatus(Request $request, Union $union)
    {
        $request->validate([
            'status' => ['required', 'boolean'],
        ]);

        $union->update([
            'status' => $request->boolean('status'),
        ]);

        return back()->with('success', 'Union status updated successfully.');
    }

    /**
     * Bulk delete unions.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:unions,id',
        ]);

        Union::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Selected unions deleted successfully.');
    }
}
