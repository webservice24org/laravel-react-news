<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OfficeInfo;
use Inertia\Inertia;

class OfficeInfoController extends Controller
{
    public function index()
    {
        $office = OfficeInfo::first();

        return Inertia::render('Admin/OfficeInfo/Index', [
            'office' => $office
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'office_address' => ['nullable','string'],
            'mobile' => ['nullable','string','max:50'],
            'phone' => ['nullable','string','max:50'],
            'email' => ['nullable','email','max:255'],
            'editor_title' => ['nullable','string','max:255'],
            'editor_name' => ['nullable','string','max:255'],
        ]);

        OfficeInfo::updateOrCreate(
            ['id' => 1],
            $data
        );

        return back()->with('success','Office information saved successfully');
    }
}