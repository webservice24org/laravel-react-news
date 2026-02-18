<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class SubCategory extends Model
{
    protected $fillable = ['category_id', 'name', 'slug', 'status', 'order_no',];

    protected $casts = [
        'status' => 'boolean',
    ];

    

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    
}
