<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Category;

class Menu extends Model
{
    protected $fillable = [
        'title', 'url', 'type', 'category_id', 'sub_category_id', 'parent_id', 'order'
    ];

    // Direct children
    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')->orderBy('order');
    }

    // Recursive children (nested for any depth)
    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }
}