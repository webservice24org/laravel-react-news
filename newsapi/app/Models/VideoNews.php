<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoNews extends Model
{
    use HasFactory;
    protected $fillable = ['video_title', 'video_link', 'video_thumbnail', 'isTop'];
}
