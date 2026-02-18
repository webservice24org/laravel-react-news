<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class SuperAdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'mdmhddin@gmail.com'],
            [
                'name' => 'Mohiuddin',
                'password' => Hash::make('password'), 
            ]
        );

        $user->assignRole('Admin');
    }
}
