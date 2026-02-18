<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Upazila;

class Union extends Model
{
    use HasFactory;

    protected $fillable = [
        'upazila_id',
        'name',
        'slug',
        'status',
        'order_no',
    ];

    // Relationship: Union belongs to Upazila
    
    public function upazila()
    {
        return $this->belongsTo(Upazila::class);
    }

}
