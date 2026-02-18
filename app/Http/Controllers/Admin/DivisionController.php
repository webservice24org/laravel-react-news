<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Division;
use Inertia\Inertia;
use Illuminate\Support\Str;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $divisions = Division::orderBy('order_no')->get();

        return Inertia::render('Admin/Division/Index', [
            'divisions' => $divisions,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'slug'     => 'nullable|string|max:255|unique:divisions,slug',
            'status'   => 'required|boolean',
            'order_no' => 'nullable|integer',
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        Division::create($data);

        return back()->with('success', 'Division created successfully');
    }

    public function update(Request $request, Division $division)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'slug'     => 'nullable|string|max:255|unique:divisions,slug,' . $division->id,
            'status'   => 'required|boolean',
            'order_no' => 'nullable|integer',
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $division->update($data);

        return back()->with('success', 'Division updated successfully');
    }

    public function destroy(Division $division)
    {
        $division->delete();

        return back()->with('success', 'Division deleted successfully');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['integer', 'exists:divisions,id'],
        ])['ids'];

        Division::whereIn('id', $ids)->delete();

        return back()->with('success', count($ids) . ' division(s) deleted');
    }


    public function toggleStatus(Division $division)
    {
        $division->update([
            'status' => ! $division->status,
        ]);

        return back()->with('success', 'Division status updated');
    }





}
