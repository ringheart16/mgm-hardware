<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id('user_id');
                $table->integer('employee_id')->nullable();
                $table->string('username', 50)->unique();
                $table->string('email', 100)->unique();
                $table->string('password');
                $table->enum('role', ['admin', 'user'])->default('user');
                $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
                $table->rememberToken();
                $table->timestamps();

                $table->foreign('employee_id')->references('employee_id')->on('employees')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
