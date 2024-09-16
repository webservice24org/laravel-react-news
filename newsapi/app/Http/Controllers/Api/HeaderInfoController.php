<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeaderData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HeaderInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $headerInfos = HeaderData::all();
        return response()->json($headerInfos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'header_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'fave_icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video_btn_text' => 'nullable|string|max:255',
            'video_link' => 'nullable|string',
        ]);

        $input = $request->all();

        // Handle header logo upload
        if ($request->hasFile('header_logo')) {
            $file = $request->file('header_logo');
            $filename = time() . '_header.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename);
            $input['header_logo'] = $filename;
        }

        // Handle favicon upload
        if ($request->hasFile('fave_icon')) {
            $file = $request->file('fave_icon');
            $filename = time() . '_favicon.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename);
            $input['fave_icon'] = $filename;
        }

        $headerData = HeaderData::create($input);

        return response()->json(['success' => true, 'data' => $headerData, 'message' => 'Header Data Added successfully.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(HeaderData $headerInfo)
    {
        return response()->json($headerInfo);
        
    }

    public function updateData(Request $request, $id)
    {
        $request->validate([
            //'header_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            //'fave_icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video_btn_text' => 'nullable|string|max:255',
            'video_link' => 'nullable|string',
        ]);

        $headerData = HeaderData::findOrFail($id);
        $input = $request->all();

        // Handle header logo upload
        if ($request->hasFile('header_logo')) {
            $file = $request->file('header_logo');
            $filename = time() . '_header.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename);

            if ($headerData->header_logo && Storage::exists('public/logo/' . $headerData->header_logo)) {
                Storage::delete('public/logo/' . $headerData->header_logo);
            }

            $input['header_logo'] = $filename;
        } else {
            $input['header_logo'] = $headerData->header_logo;
        }

        // Handle favicon upload
        if ($request->hasFile('fave_icon')) {
            $file = $request->file('fave_icon');
            $filename = time() . '_favicon.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename);

            if ($headerData->fave_icon && Storage::exists('public/logo/' . $headerData->fave_icon)) {
                Storage::delete('public/logo/' . $headerData->fave_icon);
            }

            $input['fave_icon'] = $filename;
        } else {
            $input['fave_icon'] = $headerData->fave_icon;
        }

        $headerData->update($input);

        return response()->json(['success' => true, 'data' => $headerData, 'message' => 'Header Data Updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
