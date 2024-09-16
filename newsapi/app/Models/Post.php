<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $with = ['category', 'subcategories', 'tags', 'seo'];
    protected $fillable = [
        'post_upper_title',
        'post_title',
        'post_sub_title',
        'post_details',
        'post_slug',
        'reporter_name',
        'division_id',
        'district_id',
        'post_thumbnail',
        'thumbnail_caption',
        'thumbnail_alt',
        'view_count',
        'user_id',
        'news_source',
        'isLead',
        'videoLink',
    ];

    public function category()
    {
        return $this->hasOne(PostCategory::class, 'post_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'post_categories', 'post_id', 'category_id');
    }
    public function subCategories()
    {
        return $this->belongsToMany(SubCategory::class, 'post_subcategories', 'post_id', 'sub_category_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'post_tag', 'post_id', 'tag_id');
    }

    public function seo()
    {
        return $this->hasOne(PostSeo::class, 'post_id');
    }
    public function division()
    {
        return $this->belongsTo(Division::class, 'division_id');
    }
    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
