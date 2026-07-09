<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FrontendSetting extends Model
{
    protected $fillable = [
        'sub_lead_title',
        'latest_news_title',
        'most_viewed_title',
        'related_news_title',
        'previous_news_text',
        'next_news_text',
    ];
}
