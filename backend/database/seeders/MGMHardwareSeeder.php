<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MGMHardwareSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Categories
        if (DB::table('categories')->count() === 0) {
            DB::table('categories')->insert([
                ['category_id' => 1, 'category_name' => 'Power Tools', 'description' => 'Electric and cordless power tools'],
                ['category_id' => 2, 'category_name' => 'Hand Tools', 'description' => 'Manual tools for construction and repair'],
                ['category_id' => 3, 'category_name' => 'Fasteners', 'description' => 'Nails, screws, bolts and related items'],
                ['category_id' => 4, 'category_name' => 'Electrical', 'description' => 'Electrical hardware and accessories'],
                ['category_id' => 5, 'category_name' => 'Plumbing', 'description' => 'Plumbing tools and materials'],
                ['category_id' => 6, 'category_name' => 'Safety Equipment', 'description' => 'Personal protective equipment'],
                ['category_id' => 7, 'category_name' => 'Paint Supplies', 'description' => 'Painting tools and accessories'],
                ['category_id' => 8, 'category_name' => 'Construction Materials', 'description' => 'General construction hardware'],
                ['category_id' => 9, 'category_name' => 'Measuring Tools', 'description' => 'Tools used for measurement'],
                ['category_id' => 10, 'category_name' => 'Garden Tools', 'description' => 'Tools and equipment for gardening'],
            ]);
        }

        // 2. Customers
        if (DB::table('customers')->count() === 0) {
            DB::table('customers')->insert([
                ['customer_id' => 1, 'customer_name' => 'Cebu Builders Inc.', 'contact_person' => 'Robert Lim', 'phone' => '09181111111', 'email' => 'robert@cebubuilders.com', 'address' => 'Cebu City'],
                ['customer_id' => 2, 'customer_name' => 'Mandaue Construction', 'contact_person' => 'Kevin Tan', 'phone' => '09182222222', 'email' => 'kevin@mandaueconstruction.com', 'address' => 'Mandaue City'],
                ['customer_id' => 3, 'customer_name' => 'ABC Renovation Services', 'contact_person' => 'Michael Go', 'phone' => '09183333333', 'email' => 'michael@abcrenovation.com', 'address' => 'Lapu-Lapu City'],
                ['customer_id' => 4, 'customer_name' => 'HomePro Contractors', 'contact_person' => 'Steven Lee', 'phone' => '09184444444', 'email' => 'steven@homepro.com', 'address' => 'Cebu City'],
                ['customer_id' => 5, 'customer_name' => 'Island Renovators', 'contact_person' => 'Paul Wong', 'phone' => '09185555555', 'email' => 'paul@islandrenovators.com', 'address' => 'Talisay City'],
                ['customer_id' => 6, 'customer_name' => 'Cebu Electric Works', 'contact_person' => 'Andrew Lim', 'phone' => '09186666666', 'email' => 'andrew@cebuelectric.com', 'address' => 'Cebu City'],
                ['customer_id' => 7, 'customer_name' => 'BuildRight Services', 'contact_person' => 'James Tan', 'phone' => '09187777777', 'email' => 'james@buildright.com', 'address' => 'Mandaue City'],
                ['customer_id' => 8, 'customer_name' => 'Prime Home Builders', 'contact_person' => 'William Yu', 'phone' => '09188888888', 'email' => 'william@primehome.com', 'address' => 'Cebu City'],
                ['customer_id' => 9, 'customer_name' => 'Modern Construction Co.', 'contact_person' => 'Edward Chua', 'phone' => '09189999999', 'email' => 'edward@modernconstruction.com', 'address' => 'Lapu-Lapu City'],
                ['customer_id' => 10, 'customer_name' => 'City Maintenance Services', 'contact_person' => 'George Ong', 'phone' => '09180000000', 'email' => 'george@citymaintenance.com', 'address' => 'Cebu City'],
            ]);
        }

        // 3. Employees
        if (DB::table('employees')->count() === 0) {
            DB::table('employees')->insert([
                ['employee_id' => 1, 'first_name' => 'John', 'last_name' => 'Dela Cruz', 'position' => 'Manager', 'department' => 'Management', 'phone' => '09170000001', 'email' => 'john@smhardware.com'],
                ['employee_id' => 2, 'first_name' => 'Maria', 'last_name' => 'Santos', 'position' => 'Sales Clerk', 'department' => 'Sales', 'phone' => '09170000002', 'email' => 'maria@smhardware.com'],
                ['employee_id' => 3, 'first_name' => 'Pedro', 'last_name' => 'Garcia', 'position' => 'Warehouse Staff', 'department' => 'Warehouse', 'phone' => '09170000003', 'email' => 'pedro@smhardware.com'],
                ['employee_id' => 4, 'first_name' => 'Ana', 'last_name' => 'Reyes', 'position' => 'Cashier', 'department' => 'Finance', 'phone' => '09170000004', 'email' => 'ana@smhardware.com'],
                ['employee_id' => 5, 'first_name' => 'Jose', 'last_name' => 'Ramos', 'position' => 'Sales Clerk', 'department' => 'Sales', 'phone' => '09170000005', 'email' => 'jose@smhardware.com'],
                ['employee_id' => 6, 'first_name' => 'Carlo', 'last_name' => 'Cruz', 'position' => 'Inventory Clerk', 'department' => 'Warehouse', 'phone' => '09170000006', 'email' => 'carlo@smhardware.com'],
                ['employee_id' => 7, 'first_name' => 'Liza', 'last_name' => 'Torres', 'position' => 'Accountant', 'department' => 'Finance', 'phone' => '09170000007', 'email' => 'liza@smhardware.com'],
                ['employee_id' => 8, 'first_name' => 'Mark', 'last_name' => 'Villanueva', 'position' => 'Warehouse Supervisor', 'department' => 'Warehouse', 'phone' => '09170000008', 'email' => 'mark@smhardware.com'],
                ['employee_id' => 9, 'first_name' => 'Rosa', 'last_name' => 'Mendoza', 'position' => 'Sales Clerk', 'department' => 'Sales', 'phone' => '09170000009', 'email' => 'rosa@smhardware.com'],
                ['employee_id' => 10, 'first_name' => 'Daniel', 'last_name' => 'Flores', 'position' => 'Administrator', 'department' => 'Management', 'phone' => '09170000010', 'email' => 'daniel@smhardware.com'],
            ]);
        }

        // 4. Suppliers
        if (DB::table('suppliers')->count() === 0) {
            DB::table('suppliers')->insert([
                ['supplier_id' => 1, 'supplier_name' => 'Cebu Hardware Supply', 'contact_person' => 'Juan Santos', 'phone' => '09171234567', 'email' => 'juan@cebuahardware.com', 'address' => 'Cebu City'],
                ['supplier_id' => 2, 'supplier_name' => 'Metro Tools Trading', 'contact_person' => 'Maria Cruz', 'phone' => '09181234567', 'email' => 'maria@metrotools.com', 'address' => 'Mandaue City'],
                ['supplier_id' => 3, 'supplier_name' => 'BuildPro Philippines', 'contact_person' => 'Pedro Garcia', 'phone' => '09191234567', 'email' => 'pedro@buildpro.com', 'address' => 'Cebu City'],
                ['supplier_id' => 4, 'supplier_name' => 'Prime Electrical Supply', 'contact_person' => 'Ana Reyes', 'phone' => '09201234567', 'email' => 'ana@primeelectrical.com', 'address' => 'Lapu-Lapu City'],
                ['supplier_id' => 5, 'supplier_name' => 'Ace Construction Supply', 'contact_person' => 'Jose Ramos', 'phone' => '09211234567', 'email' => 'jose@aceconstruction.com', 'address' => 'Cebu City'],
                ['supplier_id' => 6, 'supplier_name' => 'Reliable Hardware Inc.', 'contact_person' => 'Carlo Dela Cruz', 'phone' => '09221234567', 'email' => 'carlo@reliablehardware.com', 'address' => 'Mandaue City'],
                ['supplier_id' => 7, 'supplier_name' => 'HomeFix Trading', 'contact_person' => 'Liza Torres', 'phone' => '09231234567', 'email' => 'liza@homefix.com', 'address' => 'Talisay City'],
                ['supplier_id' => 8, 'supplier_name' => 'ProBuild Hardware', 'contact_person' => 'Mark Villanueva', 'phone' => '09241234567', 'email' => 'mark@probuild.com', 'address' => 'Cebu City'],
                ['supplier_id' => 9, 'supplier_name' => 'Island Hardware Supply', 'contact_person' => 'Rosa Mendoza', 'phone' => '09251234567', 'email' => 'rosa@islandhardware.com', 'address' => 'Cebu City'],
                ['supplier_id' => 10, 'supplier_name' => 'Central Tools Distributor', 'contact_person' => 'Daniel Flores', 'phone' => '09261234567', 'email' => 'daniel@centraltools.com', 'address' => 'Mandaue City'],
            ]);
        }

        // 5. Products
        if (DB::table('products')->count() === 0) {
            DB::table('products')->insert([
                ['product_id' => 1, 'product_code' => 'PT-001', 'product_name' => 'Cordless Drill 18V', 'category_id' => 1, 'supplier_id' => 1, 'unit_price' => 4500.00, 'stock_quantity' => 23, 'reorder_level' => 5],
                ['product_id' => 2, 'product_code' => 'PT-002', 'product_name' => 'Angle Grinder 4 inch', 'category_id' => 1, 'supplier_id' => 2, 'unit_price' => 3200.00, 'stock_quantity' => 18, 'reorder_level' => 5],
                ['product_id' => 3, 'product_code' => 'HT-001', 'product_name' => 'Claw Hammer 16oz', 'category_id' => 2, 'supplier_id' => 3, 'unit_price' => 650.00, 'stock_quantity' => 40, 'reorder_level' => 10],
                ['product_id' => 4, 'product_code' => 'HT-002', 'product_name' => 'Adjustable Wrench 10 inch', 'category_id' => 2, 'supplier_id' => 5, 'unit_price' => 550.00, 'stock_quantity' => 35, 'reorder_level' => 10],
                ['product_id' => 5, 'product_code' => 'FS-001', 'product_name' => 'Wood Screws 2 inch', 'category_id' => 3, 'supplier_id' => 6, 'unit_price' => 180.00, 'stock_quantity' => 100, 'reorder_level' => 20],
                ['product_id' => 6, 'product_code' => 'EL-001', 'product_name' => 'Electrical Tape', 'category_id' => 4, 'supplier_id' => 4, 'unit_price' => 75.00, 'stock_quantity' => 80, 'reorder_level' => 20],
                ['product_id' => 7, 'product_code' => 'PL-001', 'product_name' => 'PVC Pipe Cutter', 'category_id' => 5, 'supplier_id' => 7, 'unit_price' => 850.00, 'stock_quantity' => 19, 'reorder_level' => 5],
                ['product_id' => 8, 'product_code' => 'SE-001', 'product_name' => 'Safety Helmet', 'category_id' => 6, 'supplier_id' => 8, 'unit_price' => 350.00, 'stock_quantity' => 50, 'reorder_level' => 10],
                ['product_id' => 9, 'product_code' => 'MS-001', 'product_name' => 'Digital Measuring Tape', 'category_id' => 9, 'supplier_id' => 9, 'unit_price' => 1200.00, 'stock_quantity' => 15, 'reorder_level' => 5],
                ['product_id' => 10, 'product_code' => 'GT-001', 'product_name' => 'Garden Shovel', 'category_id' => 10, 'supplier_id' => 10, 'unit_price' => 950.00, 'stock_quantity' => 25, 'reorder_level' => 5],
            ]);
        }

        // 6. Purchases
        if (DB::table('purchases')->count() === 0) {
            DB::table('purchases')->insert([
                ['purchase_id' => 1, 'supplier_id' => 1, 'employee_id' => 3, 'purchase_date' => '2026-01-05', 'total_amount' => 45000.00],
                ['purchase_id' => 2, 'supplier_id' => 2, 'employee_id' => 6, 'purchase_date' => '2026-01-12', 'total_amount' => 32000.00],
                ['purchase_id' => 3, 'supplier_id' => 3, 'employee_id' => 3, 'purchase_date' => '2026-01-20', 'total_amount' => 13000.00],
                ['purchase_id' => 4, 'supplier_id' => 4, 'employee_id' => 6, 'purchase_date' => '2026-02-02', 'total_amount' => 7500.00],
                ['purchase_id' => 5, 'supplier_id' => 5, 'employee_id' => 3, 'purchase_date' => '2026-02-10', 'total_amount' => 11000.00],
                ['purchase_id' => 6, 'supplier_id' => 6, 'employee_id' => 8, 'purchase_date' => '2026-02-18', 'total_amount' => 9000.00],
                ['purchase_id' => 7, 'supplier_id' => 7, 'employee_id' => 6, 'purchase_date' => '2026-03-01', 'total_amount' => 8500.00],
                ['purchase_id' => 8, 'supplier_id' => 8, 'employee_id' => 3, 'purchase_date' => '2026-03-10', 'total_amount' => 7000.00],
                ['purchase_id' => 9, 'supplier_id' => 9, 'employee_id' => 8, 'purchase_date' => '2026-03-18', 'total_amount' => 12000.00],
                ['purchase_id' => 10, 'supplier_id' => 10, 'employee_id' => 6, 'purchase_date' => '2026-03-25', 'total_amount' => 9500.00],
            ]);
        }

        // 7. Purchase Details
        if (DB::table('purchase_details')->count() === 0) {
            DB::table('purchase_details')->insert([
                ['purchase_detail_id' => 1, 'purchase_id' => 1, 'product_id' => 1, 'quantity' => 10, 'unit_cost' => 4500.00],
                ['purchase_detail_id' => 2, 'purchase_id' => 2, 'product_id' => 2, 'quantity' => 10, 'unit_cost' => 3200.00],
                ['purchase_detail_id' => 3, 'purchase_id' => 3, 'product_id' => 3, 'quantity' => 20, 'unit_cost' => 650.00],
                ['purchase_detail_id' => 4, 'purchase_id' => 4, 'product_id' => 6, 'quantity' => 100, 'unit_cost' => 75.00],
                ['purchase_detail_id' => 5, 'purchase_id' => 5, 'product_id' => 4, 'quantity' => 20, 'unit_cost' => 550.00],
                ['purchase_detail_id' => 6, 'purchase_id' => 6, 'product_id' => 5, 'quantity' => 50, 'unit_cost' => 180.00],
                ['purchase_detail_id' => 7, 'purchase_id' => 7, 'product_id' => 7, 'quantity' => 10, 'unit_cost' => 850.00],
                ['purchase_detail_id' => 8, 'purchase_id' => 8, 'product_id' => 8, 'quantity' => 20, 'unit_cost' => 350.00],
                ['purchase_detail_id' => 9, 'purchase_id' => 9, 'product_id' => 9, 'quantity' => 10, 'unit_cost' => 1200.00],
                ['purchase_detail_id' => 10, 'purchase_id' => 10, 'product_id' => 10, 'quantity' => 10, 'unit_cost' => 950.00],
            ]);
        }

        // 8. Sales
        if (DB::table('sales')->count() === 0) {
            DB::table('sales')->insert([
                ['sale_id' => 1, 'customer_id' => 1, 'employee_id' => 2, 'sale_date' => '2026-04-01', 'total_amount' => 9000.00],
                ['sale_id' => 2, 'customer_id' => 2, 'employee_id' => 5, 'sale_date' => '2026-04-03', 'total_amount' => 6400.00],
                ['sale_id' => 3, 'customer_id' => 3, 'employee_id' => 9, 'sale_date' => '2026-04-05', 'total_amount' => 1950.00],
                ['sale_id' => 4, 'customer_id' => 4, 'employee_id' => 2, 'sale_date' => '2026-04-08', 'total_amount' => 1650.00],
                ['sale_id' => 5, 'customer_id' => 5, 'employee_id' => 5, 'sale_date' => '2026-04-10', 'total_amount' => 3600.00],
                ['sale_id' => 6, 'customer_id' => 6, 'employee_id' => 9, 'sale_date' => '2026-04-12', 'total_amount' => 1500.00],
                ['sale_id' => 7, 'customer_id' => 7, 'employee_id' => 2, 'sale_date' => '2026-04-15', 'total_amount' => 2550.00],
                ['sale_id' => 8, 'customer_id' => 8, 'employee_id' => 5, 'sale_date' => '2026-04-18', 'total_amount' => 2100.00],
                ['sale_id' => 9, 'customer_id' => 9, 'employee_id' => 9, 'sale_date' => '2026-04-20', 'total_amount' => 2400.00],
                ['sale_id' => 10, 'customer_id' => 10, 'employee_id' => 2, 'sale_date' => '2026-04-22', 'total_amount' => 1900.00],
                ['sale_id' => 11, 'customer_id' => 1, 'employee_id' => 1, 'sale_date' => '2026-09-14', 'total_amount' => 9850.00],
            ]);
        }

        // 9. Sale Details
        if (DB::table('sale_details')->count() === 0) {
            DB::table('sale_details')->insert([
                ['sale_detail_id' => 1, 'sale_id' => 1, 'product_id' => 1, 'quantity' => 2, 'unit_price' => 4500.00],
                ['sale_detail_id' => 2, 'sale_id' => 2, 'product_id' => 2, 'quantity' => 2, 'unit_price' => 3200.00],
                ['sale_detail_id' => 3, 'sale_id' => 3, 'product_id' => 3, 'quantity' => 3, 'unit_price' => 650.00],
                ['sale_detail_id' => 4, 'sale_id' => 4, 'product_id' => 4, 'quantity' => 3, 'unit_price' => 550.00],
                ['sale_detail_id' => 5, 'sale_id' => 5, 'product_id' => 5, 'quantity' => 20, 'unit_price' => 180.00],
                ['sale_detail_id' => 6, 'sale_id' => 6, 'product_id' => 6, 'quantity' => 20, 'unit_price' => 75.00],
                ['sale_detail_id' => 7, 'sale_id' => 7, 'product_id' => 7, 'quantity' => 3, 'unit_price' => 850.00],
                ['sale_detail_id' => 8, 'sale_id' => 8, 'product_id' => 8, 'quantity' => 6, 'unit_price' => 350.00],
                ['sale_detail_id' => 9, 'sale_id' => 9, 'product_id' => 9, 'quantity' => 2, 'unit_price' => 1200.00],
                ['sale_detail_id' => 10, 'sale_id' => 10, 'product_id' => 10, 'quantity' => 2, 'unit_price' => 950.00],
                ['sale_detail_id' => 11, 'sale_id' => 11, 'product_id' => 1, 'quantity' => 2, 'unit_price' => 4500.00],
                ['sale_detail_id' => 12, 'sale_id' => 11, 'product_id' => 7, 'quantity' => 1, 'unit_price' => 850.00],
            ]);
        }

        // 10. System Settings
        if (DB::table('system_settings')->count() === 0) {
            DB::table('system_settings')->insert([
                ['setting_id' => 1, 'setting_name' => 'Company Name', 'setting_value' => 'SME Hardware Management System', 'description' => 'Name of the business'],
                ['setting_id' => 2, 'setting_name' => 'Currency', 'setting_value' => 'PHP', 'description' => 'Default system currency'],
                ['setting_id' => 3, 'setting_name' => 'Low Stock Alert', 'setting_value' => 'Enabled', 'description' => 'Enable notifications when stock reaches reorder level'],
            ]);
        }
    }
}
