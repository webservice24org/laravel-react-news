<?php

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Models\Upazila;
use App\Models\District;
use App\Models\Division;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class UpazilaController extends Controller
{
    /**
     * Display a listing of upazilas
     */
    public function index()
    {
        // Load upazilas with full hierarchy
        $upazilas = Upazila::with([
                'district:id,name,division_id',
                'district.division:id,name',
            ])
            ->orderBy('order_no')
            ->get();

        // Active districts for create/edit dropdown
        $districts = District::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name', 'division_id']);

        // Optional but VERY useful for cascading dropdown later
        $divisions = Division::where('status', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Admin/Upazila/Index', [
            'upazilas'  => $upazilas,
            'districts' => $districts,
            'divisions' => $divisions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255'],
            'district_id' => ['required', 'exists:districts,id'],
            'order_no'    => ['nullable', 'integer'],
            'status'      => ['boolean'],
        ]);

        // Auto-generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        $upazila = Upazila::create($validated);

        return back()->with('success', 'Upazila created successfully.');
    }

    public function update(Request $request, Upazila $upazila)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['nullable', 'string', 'max:255'],
            'district_id' => ['required', 'exists:districts,id'],
            'order_no'    => ['nullable', 'integer'],
            'status'      => ['boolean'],
        ]);

        // Auto-generate slug if not provided
        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);
        $upazila->update($validated);

        return back()->with('success', 'Upazila updated successfully.');
    }

    public function toggleStatus(Request $request, Upazila $upazila)
    {
        $request->validate([
            'status' => ['required', 'boolean'],
        ]);

        $upazila->update([
            'status' => $request->boolean('status'),
        ]);

        return back()->with('success', 'Upazila status updated successfully.');
    }

    public function destroy(Upazila $upazila)
    {
        $upazila->delete();

        return back()->with('success', 'Upazila deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:upazilas,id'],
        ]);

        Upazila::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Upazilas deleted successfully');
    }



}
