<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index()
    {
        $divisions = Division::all();
        return response()->json(['success' => true, 'data' => $divisions, 'message' => 'Divisions retrieved successfully.']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'division_name' => 'required|string|max:255',
        ]);

        $division = Division::create($request->all());

        return response()->json(['success' => true, 'data' => $division, 'message' => 'Division created successfully.']);
    }

    public function show($id)
    {
        $division = Division::find($id);

        if (!$division) {
            return response()->json(['success' => false, 'message' => 'Division not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => $division, 'message' => 'Division retrieved successfully.']);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'division_name' => 'required|string|max:255',
        ]);

        $division = Division::find($id);

        if (!$division) {
            return response()->json(['success' => false, 'message' => 'Division not found.'], 404);
        }

        $division->update($request->all());

        return response()->json(['success' => true, 'data' => $division, 'message' => 'Division updated successfully.']);
    }

    public function destroy($id)
    {
        $division = Division::find($id);

        if (!$division) {
            return response()->json(['success' => false, 'message' => 'Division not found.'], 404);
        }

        $division->delete();

        return response()->json(['success' => true, 'message' => 'Division deleted successfully.']);
    }
}
