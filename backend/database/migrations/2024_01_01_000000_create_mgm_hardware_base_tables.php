<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Categories
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->integer('category_id')->autoIncrement();
                $table->string('category_name', 100);
                $table->string('description', 255)->nullable();
            });
        }

        // 2. Customers
        if (!Schema::hasTable('customers')) {
            Schema::create('customers', function (Blueprint $table) {
                $table->integer('customer_id')->autoIncrement();
                $table->string('customer_name', 150);
                $table->string('contact_person', 100)->nullable();
                $table->string('phone', 30)->nullable();
                $table->string('email', 100)->nullable();
                $table->string('address', 255)->nullable();
            });
        }

        // 3. Employees
        if (!Schema::hasTable('employees')) {
            Schema::create('employees', function (Blueprint $table) {
                $table->integer('employee_id')->autoIncrement();
                $table->string('first_name', 50);
                $table->string('last_name', 50);
                $table->string('position', 100)->nullable();
                $table->string('department', 100)->nullable();
                $table->string('phone', 30)->nullable();
                $table->string('email', 100)->nullable();
            });
        }

        // 4. Suppliers
        if (!Schema::hasTable('suppliers')) {
            Schema::create('suppliers', function (Blueprint $table) {
                $table->integer('supplier_id')->autoIncrement();
                $table->string('supplier_name', 150);
                $table->string('contact_person', 100)->nullable();
                $table->string('phone', 30)->nullable();
                $table->string('email', 100)->nullable();
                $table->string('address', 255)->nullable();
            });
        }

        // 5. Products
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->integer('product_id')->autoIncrement();
                $table->string('product_code', 50)->unique();
                $table->string('product_name', 150);
                $table->integer('category_id');
                $table->integer('supplier_id');
                $table->decimal('unit_price', 10, 2);
                $table->integer('stock_quantity')->default(0);
                $table->integer('reorder_level')->default(0);

                $table->foreign('category_id')->references('category_id')->on('categories')->cascadeOnDelete();
                $table->foreign('supplier_id')->references('supplier_id')->on('suppliers')->cascadeOnDelete();
            });
        }

        // 6. Purchases
        if (!Schema::hasTable('purchases')) {
            Schema::create('purchases', function (Blueprint $table) {
                $table->integer('purchase_id')->autoIncrement();
                $table->date('purchase_date');
                $table->integer('supplier_id');
                $table->decimal('total_amount', 12, 2);
                $table->integer('employee_id');

                $table->foreign('supplier_id')->references('supplier_id')->on('suppliers')->cascadeOnDelete();
                $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            });
        }

        // 7. Purchase Details
        if (!Schema::hasTable('purchase_details')) {
            Schema::create('purchase_details', function (Blueprint $table) {
                $table->integer('purchase_detail_id')->autoIncrement();
                $table->integer('purchase_id');
                $table->integer('product_id');
                $table->integer('quantity');
                $table->decimal('unit_cost', 10, 2);

                $table->foreign('purchase_id')->references('purchase_id')->on('purchases')->cascadeOnDelete();
                $table->foreign('product_id')->references('product_id')->on('products')->cascadeOnDelete();
            });
        }

        // 8. Sales
        if (!Schema::hasTable('sales')) {
            Schema::create('sales', function (Blueprint $table) {
                $table->integer('sale_id')->autoIncrement();
                $table->date('sale_date');
                $table->integer('customer_id');
                $table->decimal('total_amount', 12, 2);
                $table->integer('employee_id');

                $table->foreign('customer_id')->references('customer_id')->on('customers')->cascadeOnDelete();
                $table->foreign('employee_id')->references('employee_id')->on('employees')->cascadeOnDelete();
            });
        }

        // 9. Sale Details
        if (!Schema::hasTable('sale_details')) {
            Schema::create('sale_details', function (Blueprint $table) {
                $table->integer('sale_detail_id')->autoIncrement();
                $table->integer('sale_id');
                $table->integer('product_id');
                $table->integer('quantity');
                $table->decimal('unit_price', 10, 2);

                $table->foreign('sale_id')->references('sale_id')->on('sales')->cascadeOnDelete();
                $table->foreign('product_id')->references('product_id')->on('products')->cascadeOnDelete();
            });
        }

        // 10. System Settings
        if (!Schema::hasTable('system_settings')) {
            Schema::create('system_settings', function (Blueprint $table) {
                $table->integer('setting_id')->autoIncrement();
                $table->string('setting_name', 100);
                $table->string('setting_value', 255);
                $table->string('description', 255)->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sale_details');
        Schema::dropIfExists('sales');
        Schema::dropIfExists('purchase_details');
        Schema::dropIfExists('purchases');
        Schema::dropIfExists('products');
        Schema::dropIfExists('suppliers');
        Schema::dropIfExists('employees');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('system_settings');
    }
};
