<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Logo;
use Inertia\Inertia;

class LogoController extends Controller
{
     public function index()
    {
        $logos = Logo::pluck('path','type');

        return Inertia::render('Admin/Logos/Index', [
            'logos' => $logos
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'header' => 'nullable|image|max:2048',
            'footer' => 'nullable|image|max:2048',
            'login' => 'nullable|image|max:2048',
            'dashboard' => 'nullable|image|max:2048',
            'print' => 'nullable|image|max:2048',
            'favicon' => 'nullable|image|max:512',
        ]);

        $types = ['header','footer','login','dashboard','print','favicon'];

        foreach ($types as $type) {

            if ($request->hasFile($type)) {

                $file = $request->file($type);
                $path = $file->store('logos','public');

                Logo::updateOrCreate(
                    ['type' => $type],
                    ['path' => $path]
                );
            }
        }

        return back()->with('success','Logos updated successfully');
    }
}
