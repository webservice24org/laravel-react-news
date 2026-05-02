<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Tag;
use App\Models\Division;
use App\Models\District;
use App\Models\Upazila;
use App\Models\Union;
use Illuminate\Support\Facades\Storage;

class NewsPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'top_title',
        'news_title',
        'hanger_title',
        'slug',
        'news_description',
        'user_id',
        'news_thumbnail',
        'thumbnail_caption',
        'meta_title',
        'meta_description',
        'is_lead',
        'is_sub_lead',
        'view_count',
        'status',
        'scheduled_at',
    ];

    protected $casts = [
        'is_lead'       => 'boolean',
        'is_sub_lead'   => 'boolean',
        'scheduled_at'  => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($post) {
            if (empty($post->slug)) {
                $post->slug = Str::slug($post->news_title);
            }
        });

        static::deleting(function ($post) {
            if ($post->news_thumbnail && Storage::disk('public')->exists($post->news_thumbnail)) {
                Storage::disk('public')->delete($post->news_thumbnail);
            }
        });

    }

    

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_news_post', 'news_post_id', 'category_id');
    }

    public function subCategories()
    {
        // pivot column is sub_category_id ✅ matches your migration
        return $this->belongsToMany(SubCategory::class, 'subcategory_news_post', 'news_post_id', 'sub_category_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'tag_news_post', 'news_post_id', 'tag_id');
    }

    // ✅ Location pivots (explicit keys)
    public function divisions()
    {
        return $this->belongsToMany(Division::class, 'division_news_post', 'news_post_id', 'division_id');
    }

    public function districts()
    {
        return $this->belongsToMany(District::class, 'district_news_post', 'news_post_id', 'district_id');
    }

    public function upazilas()
    {
        return $this->belongsToMany(Upazila::class, 'upazila_news_post', 'news_post_id', 'upazila_id');
    }

    public function unions()
    {
        return $this->belongsToMany(Union::class, 'union_news_post', 'news_post_id', 'union_id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
