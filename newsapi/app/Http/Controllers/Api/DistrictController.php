<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Division;
use Illuminate\Http\Request;

class DistrictController extends Controller
{

    /*
    public function index(Request $request)
    {
        $divisionId = $request->query('division_id');
        $districts = District::where('division_id', $divisionId)->get();
        return response()->json(['data' => $districts]);
    }
        */
    
        public function index(Request $request)
        {
            $divisionId = $request->query('division_id');

            if ($divisionId) {
                $districts = District::where('division_id', $divisionId)->get();
            } else {
                $districts = District::all();
            }

            return response()->json(['data' => $districts]);
        }


    public function store(Request $request)
{
    try {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'district_name' => 'required|string|max:255',
        ]);

        $district = District::create($request->all());

        return response()->json(['success' => true, 'data' => $district, 'message' => 'District created successfully.']);
    } catch (\Exception $e) {
        // Log the error for debugging
        \Log::error('Error creating district: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Server Error.'], 500);
    }
}



    public function show(District $district)
    {
        return response()->json(['success' => true, 'data' => $district, 'message' => 'District retrieved successfully.']);
    }

    public function update(Request $request, District $district)
    {
        $request->validate([
            'division_id' => 'required|exists:divisions,id',
            'district_name' => 'required|string|max:255',
        ]);

        $district->update($request->all());

        return response()->json(['success' => true, 'data' => $district, 'message' => 'District updated successfully.']);
    }


    public function destroy(District $district)
    {
        $district->delete();

        return response()->json(['success' => true, 'message' => 'District deleted successfully.']);
    }

    public function getDistrictsByDivision($divisionId)
    {
        $division = Division::with('districts')->find($divisionId);
    
        if (!$division) {
            return response()->json(['error' => 'Division not found'], 404);
        }
    
        $response = [
            'divisionName' => $division->division_name,
            'divisionId' => $division->id,
            'districts' => $division->districts->map(function ($district) {
                return [
                    'id' => $district->id,
                    'name' => $district->district_name
                ];
            })
        ];
    
        return response()->json($response);
    }


}
