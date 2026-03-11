<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialConnection extends Model
{
    protected $fillable = [
        'facebook_url',
        'twitter_url',
        'pinterest_url',
        'tiktok_url',
        'instagram_url',
        'youtube_url',
        'whatsapp_url',
    ];
}