<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\District;

class Upazila extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'district_id',
        'name',
        'slug',
        'status',
        'order_no',
    ];
    protected $casts = [
        'status' => 'boolean',
    ];
    public function district()
    {
        return $this->belongsTo(District::class);
    }
    
    /**
     * Upazila has a Division (through District)
     * VERY useful for future filtering & dropdowns
     */
    public function division()
    {
        return $this->district?->division();
    }


}
