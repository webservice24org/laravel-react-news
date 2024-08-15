<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PostSubcategory extends Model
{
    use HasFactory;
    protected $table = 'post_subcategories';
    protected $fillable = ['post_id', 'sub_category_id'];
    protected $guarded = [];
}
