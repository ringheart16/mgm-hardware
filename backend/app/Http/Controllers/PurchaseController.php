<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['supplier', 'employee', 'details.product']);

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('purchase_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('purchase_date', '<=', $request->date_to);
        }

        return response()->json($query->orderBy('purchase_id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|integer|exists:suppliers,supplier_id',
            'employee_id' => 'required|integer|exists:employees,employee_id',
            'purchase_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,product_id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            $totalAmount = collect($request->items)->sum(function ($item) {
                return $item['quantity'] * $item['unit_cost'];
            });

            $purchase = Purchase::create([
                'supplier_id' => $request->supplier_id,
                'employee_id' => $request->employee_id,
                'purchase_date' => $request->purchase_date,
                'total_amount' => $totalAmount,
            ]);

            foreach ($request->items as $item) {
                PurchaseDetail::create([
                    'purchase_id' => $purchase->purchase_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                ]);

                // Update stock
                Product::where('product_id', $item['product_id'])
                    ->increment('stock_quantity', $item['quantity']);
            }

            $purchase->load(['supplier', 'employee', 'details.product']);
            return response()->json($purchase, 201);
        });
    }

    public function show(int $id)
    {
        $purchase = Purchase::with(['supplier', 'employee', 'details.product'])->findOrFail($id);
        return response()->json($purchase);
    }

    public function destroy(int $id)
    {
        $purchase = Purchase::with('details')->findOrFail($id);

        DB::transaction(function () use ($purchase) {
            foreach ($purchase->details as $detail) {
                Product::where('product_id', $detail->product_id)
                    ->decrement('stock_quantity', $detail->quantity);
            }
            $purchase->details()->delete();
            $purchase->delete();
        });

        return response()->json(['message' => 'Purchase deleted and stock adjusted']);
    }
}
