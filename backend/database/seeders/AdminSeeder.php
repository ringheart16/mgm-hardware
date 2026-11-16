<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['username' => 'admin'],
            [
                'employee_id' => 1,
                'email' => 'admin@mgmhardware.com',
                'password' => 'admin123',
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        User::firstOrCreate(
            ['username' => 'cashier'],
            [
                'employee_id' => 2,
                'email' => 'cashier@mgmhardware.com',
                'password' => 'cashier123',
                'role' => 'user',
                'status' => 'active',
            ]
        );
    }
}
