<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['category_name', 'description'];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_categories', 'category_id', 'post_id');
    }

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }

    public function subCats()
    {
        return $this->belongsToMany(SubCategory::class, 'post_subcategories', 'post_id', 'sub_category_id');
    }

    
    


}
