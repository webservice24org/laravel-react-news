<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeInfo extends Model
{
    protected $fillable = [
        'office_address',
        'mobile',
        'phone',
        'email',
        'editor_title',
        'editor_name',
    ];
}