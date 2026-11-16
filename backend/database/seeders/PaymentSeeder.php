<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $methods = ['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Card'];
        $sales = Sale::all();

        foreach ($sales as $index => $sale) {
            $method = $methods[$index % count($methods)];
            $ref = in_array($method, ['GCash', 'Maya', 'Bank Transfer']) ? 'REF-' . strtoupper(substr(md5($sale->sale_id . 'salt'), 0, 10)) : null;

            Payment::firstOrCreate(
                ['sale_id' => $sale->sale_id],
                [
                    'payment_method' => $method,
                    'reference_number' => $ref,
                    'amount_paid' => $sale->total_amount,
                    'change_amount' => 0.00,
                    'payment_date' => $sale->sale_date->format('Y-m-d') . ' 10:30:00',
                    'received_by' => 1,
                ]
            );
        }
    }
}
