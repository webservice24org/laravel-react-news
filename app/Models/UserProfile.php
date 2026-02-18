<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class UserProfile extends Model
{
     use HasFactory;

    protected $fillable = [
        'user_id',
        'profile_photo',
        'address',
        'about',
        'dob',
        'nid_number',
        'mobile_number',
    ];

    protected $casts = [
        'dob' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
