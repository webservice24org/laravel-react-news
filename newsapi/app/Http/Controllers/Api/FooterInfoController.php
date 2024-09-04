<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\footerInfo;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class FooterInfoController extends Controller
{
    
    public function index()
    {
        $footerInfos = footerInfo::all();
        return response()->json($footerInfos);
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'footer_logo' => 'nullable|string',
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

        $footerInfo = footerInfo::create($request->all());
        return response()->json(['success' => true, 'data' => $footerInfo, 'message' => 'Footer Information Added successfully.']);
    }

    
    public function show(footerInfo $footerInfo)
    {
        return response()->json($footerInfo);
    }

   
    public function update(Request $request, footerInfo $footerInfo)
    {
        $request->validate([
            'footer_logo' => 'nullable|string',
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

        $footerInfo->update($request->all());
        return response()->json(['success' => true, 'data' => $footerInfo, 'message' => 'Footer Information Updated successfully.']);
    }

    
}
