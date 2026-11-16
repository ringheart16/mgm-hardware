<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Customer;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $totalProducts = Product::count();
        $totalCustomers = Customer::count();

        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'reorder_level')
            ->where('stock_quantity', '>', 0)
            ->with(['category', 'supplier'])
            ->get();

        $outOfStockProducts = Product::where('stock_quantity', '<=', 0)
            ->with(['category', 'supplier'])
            ->get();

        // Sales stats
        $todaySales = Sale::whereDate('sale_date', today())->sum('total_amount');
        $monthSales = Sale::whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');
        $totalSales = Sale::sum('total_amount');
        $totalSalesCount = Sale::count();

        // Purchases stats
        $monthPurchases = Purchase::whereMonth('purchase_date', now()->month)
            ->whereYear('purchase_date', now()->year)
            ->sum('total_amount');

        // Recent sales
        $recentSales = Sale::with(['customer', 'employee', 'payment'])
            ->orderBy('sale_id', 'desc')
            ->limit(10)
            ->get();

        // Sales by month (last 6 months)
        $salesByMonth = Sale::select(
                DB::raw("DATE_FORMAT(sale_date, '%Y-%m') as month"),
                DB::raw('SUM(total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->where('sale_date', '>=', now()->subMonths(6)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Top selling products
        $topProducts = DB::table('sale_details')
            ->join('products', 'sale_details.product_id', '=', 'products.product_id')
            ->select(
                'products.product_name',
                DB::raw('SUM(sale_details.quantity) as total_qty'),
                DB::raw('SUM(sale_details.quantity * sale_details.unit_price) as total_revenue')
            )
            ->groupBy('products.product_id', 'products.product_name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // Sales by category
        $salesByCategory = DB::table('sale_details')
            ->join('products', 'sale_details.product_id', '=', 'products.product_id')
            ->join('categories', 'products.category_id', '=', 'categories.category_id')
            ->select(
                'categories.category_name',
                DB::raw('SUM(sale_details.quantity * sale_details.unit_price) as total')
            )
            ->groupBy('categories.category_id', 'categories.category_name')
            ->orderByDesc('total')
            ->get();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'total_customers' => $totalCustomers,
                'today_sales' => (float) $todaySales,
                'month_sales' => (float) $monthSales,
                'total_sales' => (float) $totalSales,
                'total_sales_count' => $totalSalesCount,
                'month_purchases' => (float) $monthPurchases,
                'low_stock_count' => $lowStockProducts->count(),
                'out_of_stock_count' => $outOfStockProducts->count(),
            ],
            'low_stock_products' => $lowStockProducts,
            'out_of_stock_products' => $outOfStockProducts,
            'recent_sales' => $recentSales,
            'sales_by_month' => $salesByMonth,
            'top_products' => $topProducts,
            'sales_by_category' => $salesByCategory,
        ]);
    }
}
