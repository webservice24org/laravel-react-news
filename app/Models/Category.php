<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\SubCategory;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'status',
        'order_no',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    

    public function subcategories(): HasMany
    {
        return $this->hasMany(SubCategory::class)
                ->where('status', 1) // optional: only active
                ->orderBy('order_no', 'asc'); // order by order_no
    }




}
