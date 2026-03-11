<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_name',
        'ad_image',
        'ad_url',
        'ad_code',
        'is_global',
        'status',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'advertisement_category');
    }

    public function subCategories()
    {
        return $this->belongsToMany(SubCategory::class, 'advertisement_sub_category');
    }


}
