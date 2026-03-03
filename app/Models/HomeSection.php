<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeSection extends Model
{
    use HasFactory;

    protected $fillable = ['type', 'category_slug', 'limit', 'order'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_slug', 'slug');
    }


}