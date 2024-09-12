<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertising;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class AdvertisingController extends Controller
{
    
    public function index()
    {
        $advertisings = Advertising::all();
        return response()->json($advertisings, 200);
    }

    public function store(Request $request)
    {
        try {
            // Validate incoming request data
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'advert_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
                'code' => 'nullable|string',
                'status' => 'required|boolean',
            ]);
    
            // Handle file upload
            if ($request->hasFile('advert_image')) {
                $file = $request->file('advert_image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/advertising', $filename);
                $validatedData['advert_image'] = $filename;
            } else {
                $validatedData['advert_image'] = null;
            }

            // Create new Advertising record
            $advertising = Advertising::create($validatedData);
    
            return response()->json([
                'success' => true,
                'data' => $advertising,
                'message' => 'Advertising created successfully.'
            ]);
    
        } catch (\Exception $e) {
            \Log::error('Error storing advertising: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'input' => $request->all()
            ]);
    
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating advertising.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    




    public function show($id)
    {
        $advertising = Advertising::find($id);

        if ($advertising) {
            return response()->json(['success' => true, 'data' => $advertising, 'message' => 'Advertising Fetched successfully.']);
        } else {
            return response()->json(['message' => 'Advertising not found'], 404);
        }
    }

    public function updateAdvert(Request $request, $id)
{
    try {
        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            //'advert_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'code' => 'sometimes|required|string',
            'status' => 'required|boolean',
        ]);

        $advertising = Advertising::find($id);

        if ($advertising) {
            if ($request->hasFile('advert_image')) {
                // Delete the old image if exists
                if ($advertising->advert_image) {
                    Storage::delete('public/advertising/' . $advertising->advert_image);
                }

                // Store the new image
                $file = $request->file('advert_image');
                $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/advertising', $filename);
                $validatedData['advert_image'] = $filename;
            }

            // Update the Advertising record
            $advertising->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $advertising,
                'message' => 'Advertising updated successfully.'
            ]);
        } else {
            return response()->json(['message' => 'Advertising not found'], 404);
        }

    } catch (\Exception $e) {
        \Log::error('Error updating advertising: ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString(),
            'input' => $request->all()
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An error occurred while updating advertising.',
            'error' => $e->getMessage()
        ], 500);
    }
}



    public function destroy($id)
{
    $advertising = Advertising::find($id);

    if ($advertising) {
        if ($advertising->advert_image) {
            Storage::delete('public/advertising/' . $advertising->advert_image);
        }

        $advertising->delete();

        return response()->json(['message' => 'Advertising deleted successfully'], 200);
    } else {
        return response()->json(['message' => 'Advertising not found'], 404);
    }
}
}
