<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterData extends Model
{
    use HasFactory;
    protected $fillable = [
        'footer_info', 'address_one', 'address_two', 'phone', 'mobile', 
        'chairman_name', 'chairman_designation', 'md_name', 'md_designation', 'footer_logo'
    ];
    
}
