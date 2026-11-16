<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        $query = Sale::with(['customer', 'employee', 'payment', 'details.product']);

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        $sales = $query->orderBy('sale_date', 'desc')->get();

        $summary = [
            'total_sales' => $sales->sum('total_amount'),
            'total_transactions' => $sales->count(),
            'average_sale' => $sales->count() > 0 ? $sales->avg('total_amount') : 0,
        ];

        return response()->json([
            'sales' => $sales,
            'summary' => $summary,
        ]);
    }

    public function purchaseReport(Request $request)
    {
        $query = Purchase::with(['supplier', 'employee', 'details.product']);

        if ($request->filled('date_from')) {
            $query->whereDate('purchase_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('purchase_date', '<=', $request->date_to);
        }

        $purchases = $query->orderBy('purchase_date', 'desc')->get();

        $summary = [
            'total_purchases' => $purchases->sum('total_amount'),
            'total_orders' => $purchases->count(),
            'average_purchase' => $purchases->count() > 0 ? $purchases->avg('total_amount') : 0,
        ];

        return response()->json([
            'purchases' => $purchases,
            'summary' => $summary,
        ]);
    }

    public function inventoryReport()
    {
        $products = Product::with(['category', 'supplier'])->get();

        $totalValue = $products->sum(function ($p) {
            return $p->stock_quantity * $p->unit_price;
        });

        $summary = [
            'total_products' => $products->count(),
            'total_stock_value' => $totalValue,
            'low_stock' => $products->filter(fn($p) => $p->isLowStock())->count(),
            'out_of_stock' => $products->filter(fn($p) => $p->isOutOfStock())->count(),
            'in_stock' => $products->filter(fn($p) => !$p->isLowStock() && !$p->isOutOfStock())->count(),
        ];

        return response()->json([
            'products' => $products,
            'summary' => $summary,
        ]);
    }

    public function paymentReport(Request $request)
    {
        $query = Payment::with(['sale.customer', 'receivedByUser']);

        if ($request->filled('date_from')) {
            $query->whereDate('payment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('payment_date', '<=', $request->date_to);
        }

        $payments = $query->orderBy('payment_date', 'desc')->get();

        $byMethod = $payments->groupBy('payment_method')->map(function ($group) {
            return [
                'count' => $group->count(),
                'total' => $group->sum('amount_paid'),
            ];
        });

        return response()->json([
            'payments' => $payments,
            'by_method' => $byMethod,
            'total_collected' => $payments->sum('amount_paid'),
        ]);
    }
}
