<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Division;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Upazila;

class District extends Model
{
    use HasFactory;

    protected $fillable = [
        'division_id',
        'name',
        'slug',
        'status',
        'order_no',
    ];

    /**
     * The division this district belongs to
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }
    public function upazilas()
    {
        return $this->hasMany(Upazila::class);
    }


}
