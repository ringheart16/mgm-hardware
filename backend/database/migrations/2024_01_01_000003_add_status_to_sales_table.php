<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            if (!Schema::hasColumn('sales', 'status')) {
                $table->enum('status', ['pending', 'completed', 'cancelled'])->default('completed')->after('total_amount');
            }
            if (!Schema::hasColumn('sales', 'payment_status')) {
                $table->enum('payment_status', ['unpaid', 'paid', 'partial'])->default('paid')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['status', 'payment_status']);
        });
    }
};
