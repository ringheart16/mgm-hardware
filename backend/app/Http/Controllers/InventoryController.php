<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->filled('status')) {
            switch ($request->status) {
                case 'low':
                    $query->whereColumn('stock_quantity', '<=', 'reorder_level')
                        ->where('stock_quantity', '>', 0);
                    break;
                case 'out':
                    $query->where('stock_quantity', '<=', 0);
                    break;
                case 'in':
                    $query->whereColumn('stock_quantity', '>', 'reorder_level');
                    break;
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('product_code', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('stock_quantity', 'asc')->get());
    }

    public function updateStock(Request $request, int $id)
    {
        $request->validate([
            'stock_quantity' => 'required|integer|min:0',
            'reorder_level' => 'sometimes|integer|min:0',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->only(['stock_quantity', 'reorder_level']));
        $product->load(['category', 'supplier']);

        return response()->json($product);
    }

    public function adjustStock(Request $request, int $id)
    {
        $request->validate([
            'adjustment' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        $product = Product::findOrFail($id);
        $newQty = $product->stock_quantity + $request->adjustment;

        if ($newQty < 0) {
            return response()->json(['message' => 'Stock cannot be negative.'], 422);
        }

        $product->update(['stock_quantity' => $newQty]);
        $product->load(['category', 'supplier']);

        return response()->json($product);
    }
}
