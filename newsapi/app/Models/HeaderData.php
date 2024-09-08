<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeaderData extends Model
{
    use HasFactory;
    protected $fillable = [
        'header_logo', 'fave_icon', 'video_btn_text', 'video_link', 
        
    ];
}
