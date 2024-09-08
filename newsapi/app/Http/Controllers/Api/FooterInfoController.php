<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FooterData;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;


class FooterInfoController extends Controller
{
    
    public function index()
    {
        $footerInfos = FooterData::all();
        return response()->json($footerInfos);
    }

   
    public function store(Request $request)
    {
        $request->validate([
            //'footer_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate image file
            'footer_info' => 'nullable|string',
            'address_one' => 'required|string',
            'address_two' => 'required|string',
            'phone' => 'required|string',
            'mobile' => 'required|string',
            'chairman_name' => 'nullable|string',
            'chairman_designation' => 'nullable|string',
            'md_name' => 'nullable|string',
            'md_designation' => 'nullable|string',
        ]);

        $input = $request->all();

        if ($request->hasFile('footer_logo')) {
            $file = $request->file('footer_logo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename); 
            $input['footer_logo'] = $filename;
        } else {
            $input['footer_logo'] = null; 
        }

        $footerInfo = FooterData::create($input);

        return response()->json(['success' => true, 'data' => $footerInfo, 'message' => 'Footer Information Added successfully.']);
    }

    
    public function show(FooterData $footerInfo)
    {
        return response()->json($footerInfo);
        
    }

    public function updateData(Request $request, $id)
    {
        $request->validate([
            'footer_info' => 'nullable|string',
            'address_one' => 'required|string',
            'address_two' => 'required|string',
            'phone' => 'required|string',
            'mobile' => 'required|string',
            'chairman_name' => 'nullable|string',
            'chairman_designation' => 'nullable|string',
            'md_name' => 'nullable|string',
            'md_designation' => 'nullable|string'
            //'footer_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048' 
        ]);


        $footerInfo = FooterData::findOrFail($id); 
        $input = $request->all();

        if ($request->hasFile('footer_logo')) {
            $file = $request->file('footer_logo');
            $filename = time() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('public/logo', $filename); 

            if ($footerInfo->footer_logo && Storage::exists('public/logo/' . $footerInfo->footer_logo)) {
                Storage::delete('public/logo/' . $footerInfo->footer_logo);
            }

            $input['footer_logo'] = $filename;
        } else {
            $input['footer_logo'] = $footerInfo->footer_logo;
        }

        $footerInfo->update($input);

        return response()->json(['success' => true, 'data' => $footerInfo, 'message' => 'Footer Information Updated successfully.']);
    }



    
}
