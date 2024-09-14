<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubMenu extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'link',
        'menu_id',
        'position',
        'status',
    ];

    // Define relationship with Menu
    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
