<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SocialConnection;
use Inertia\Inertia;

class SocialConnectionController extends Controller
{
     public function index()
    {
        $social = SocialConnection::first();

        return Inertia::render('Admin/SocialConnections/Index', [
            'social' => $social
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'facebook_url' => ['nullable','url','max:255'],
            'twitter_url' => ['nullable','url','max:255'],
            'pinterest_url' => ['nullable','url','max:255'],
            'tiktok_url' => ['nullable','url','max:255'],
            'instagram_url' => ['nullable','url','max:255'],
            'youtube_url' => ['nullable','url','max:255'],
            'whatsapp_url' => ['nullable','url','max:255'],
        ]);

        SocialConnection::updateOrCreate(
            ['id' => 1],
            $data
        );

        return back()->with('success','Social connections saved successfully');
    }
}
