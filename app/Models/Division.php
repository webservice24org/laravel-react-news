<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Division extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'status',
        'order_no',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
    



}
