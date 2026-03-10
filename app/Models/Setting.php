<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'website_name',
        'tagline',
        'meta_tags',
        'meta_description',
        'copyright_credit'
    ];
}