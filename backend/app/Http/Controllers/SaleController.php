<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['customer', 'employee', 'details.product', 'payment']);

        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // For regular users, only show their transactions
        if ($request->user() && !$request->user()->isAdmin()) {
            if ($request->user()->employee_id) {
                $query->where('employee_id', $request->user()->employee_id);
            }
        }

        return response()->json($query->orderBy('sale_id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|integer|exists:customers,customer_id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,product_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'payment_method' => 'required|in:Cash,GCash,Maya,Bank Transfer,Card',
            'amount_paid' => 'required|numeric|min:0',
            'reference_number' => 'nullable|string|max:100',
        ]);

        return DB::transaction(function () use ($request) {
            // Verify stock availability
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                if ($product->stock_quantity < $item['quantity']) {
                    return response()->json([
                        'message' => "Insufficient stock for {$product->product_name}. Available: {$product->stock_quantity}",
                    ], 422);
                }
            }

            $totalAmount = collect($request->items)->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $employeeId = $request->user()->employee_id ?? 1;

            $sale = Sale::create([
                'customer_id' => $request->customer_id,
                'employee_id' => $employeeId,
                'sale_date' => now()->toDateString(),
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'payment_status' => 'paid',
            ]);

            foreach ($request->items as $item) {
                SaleDetail::create([
                    'sale_id' => $sale->sale_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                Product::where('product_id', $item['product_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }

            $changeAmount = max(0, $request->amount_paid - $totalAmount);

            Payment::create([
                'sale_id' => $sale->sale_id,
                'payment_method' => $request->payment_method,
                'reference_number' => $request->reference_number,
                'amount_paid' => $request->amount_paid,
                'change_amount' => $changeAmount,
                'payment_date' => now(),
                'received_by' => $request->user()->user_id,
            ]);

            $sale->load(['customer', 'employee', 'details.product', 'payment']);
            return response()->json($sale, 201);
        });
    }

    public function show(int $id)
    {
        $sale = Sale::with(['customer', 'employee', 'details.product', 'payment'])->findOrFail($id);
        return response()->json($sale);
    }

    public function cancel(int $id)
    {
        $sale = Sale::with('details')->findOrFail($id);

        if ($sale->status === 'cancelled') {
            return response()->json(['message' => 'Sale is already cancelled'], 422);
        }

        DB::transaction(function () use ($sale) {
            foreach ($sale->details as $detail) {
                Product::where('product_id', $detail->product_id)
                    ->increment('stock_quantity', $detail->quantity);
            }

            $sale->update([
                'status' => 'cancelled',
                'payment_status' => 'unpaid',
            ]);
        });

        return response()->json(['message' => 'Sale cancelled and stock restored']);
    }

    public function receipt(int $id)
    {
        $sale = Sale::with(['customer', 'employee', 'details.product', 'payment'])->findOrFail($id);
        return response()->json($sale);
    }
}
