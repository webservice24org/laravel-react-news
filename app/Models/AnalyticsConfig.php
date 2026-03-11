<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalyticsConfig extends Model
{
    protected $fillable = [
        'property_id',
        'service_account_json',
    ];
}
