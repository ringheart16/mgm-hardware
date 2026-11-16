<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            MGMHardwareSeeder::class,
            AdminSeeder::class,
            PaymentSeeder::class,
        ]);

        // Fix PostgreSQL sequences after manual primary key insertions
        if (DB::getDriverName() === 'pgsql') {
            $tables = [
                'categories' => 'category_id',
                'customers' => 'customer_id',
                'employees' => 'employee_id',
                'suppliers' => 'supplier_id',
                'products' => 'product_id',
                'purchases' => 'purchase_id',
                'purchase_details' => 'purchase_detail_id',
                'sales' => 'sale_id',
                'sale_details' => 'sale_detail_id',
                'system_settings' => 'setting_id',
                'users' => 'user_id',
                'payments' => 'payment_id',
            ];

            foreach ($tables as $table => $idCol) {
                try {
                    DB::statement("SELECT setval(pg_get_serial_sequence('{$table}', '{$idCol}'), COALESCE((SELECT MAX({$idCol}) FROM {$table}), 1))");
                } catch (\Throwable $e) {
                    // Ignore if sequence name differs or table not present
                }
            }
        }
    }
}
