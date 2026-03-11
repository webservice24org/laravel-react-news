<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FallbackImage extends Model
{
   use HasFactory;

    protected $fillable = [
        'type',
        'path',
    ];

    const NEWS_THUMBNAIL = 'news_thumbnail';
}
