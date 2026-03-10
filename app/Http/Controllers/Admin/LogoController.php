<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Logo;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

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

            if (!$request->hasFile($type)) {
                continue;
            }

            $file = $request->file($type);

            $existing = Logo::where('type',$type)->first();

            // delete old file if exists
            if ($existing && Storage::disk('public')->exists($existing->path)) {
                Storage::disk('public')->delete($existing->path);
            }

            $path = $file->store('logos','public');

            Logo::updateOrCreate(
                ['type' => $type],
                ['path' => $path]
            );
        }

        return back()->with('success','Logos updated successfully');
    }
}
