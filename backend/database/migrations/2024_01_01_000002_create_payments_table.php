<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id('payment_id');
                $table->integer('sale_id');
                $table->enum('payment_method', ['Cash', 'GCash', 'Maya', 'Bank Transfer', 'Card'])->default('Cash');
                $table->string('reference_number', 100)->nullable();
                $table->decimal('amount_paid', 12, 2);
                $table->decimal('change_amount', 12, 2)->default(0);
                $table->dateTime('payment_date');
                $table->unsignedBigInteger('received_by')->nullable();

                $table->foreign('sale_id')->references('sale_id')->on('sales')->cascadeOnDelete();
                $table->foreign('received_by')->references('user_id')->on('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
