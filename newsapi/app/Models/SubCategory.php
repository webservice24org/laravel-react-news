<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubCategory extends Model
{
    use HasFactory;
    protected $fillable = ['category_id','sub_category_name', 'description'];

    public function posts()
    {
        return $this->belongsToMany(Post::class, 'post_subcategories', 'sub_category_id', 'post_id');
    }
}
