<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Logo extends Model
{
    protected $fillable = [
        'type',
        'path',
        'alt'
    ];

    const HEADER = 'header';
    const FOOTER = 'footer';
    const LOGIN = 'login';
    const DASHBOARD = 'dashboard';
    const PRINT = 'print';
    const FAVICON = 'favicon';
}