<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MailConfig;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class MailConfigController extends Controller
{
    public function index()
    {
        $config = MailConfig::first();
        return Inertia::render('Admin/MailConfig/Index', [
            'config' => $config
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mailer' => 'required|string',
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'required|string',
            'encryption' => 'nullable|string',
            'from_address' => 'required|email',
            'from_name' => 'nullable|string',
        ]);

        MailConfig::updateOrCreate(
            ['id' => 1],
            [
                'mailer' => $request->mailer,
                'host' => $request->host,
                'port' => $request->port,
                'username' => $request->username,
                'password' => Crypt::encryptString($request->password),
                'encryption' => $request->encryption,
                'from_address' => $request->from_address,
                'from_name' => $request->from_name,
            ]
        );

        cache()->forget('mail_configs');

        return back()->with('success', 'Mail configuration saved successfully.');
    }
}
