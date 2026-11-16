<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['category', 'supplier']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                  ->orWhere('product_code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        if ($request->filled('stock_status')) {
            switch ($request->stock_status) {
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

        $sortBy = $request->get('sort_by', 'product_id');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $products = $request->filled('per_page')
            ? $query->paginate($request->per_page)
            : $query->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_code' => 'required|string|max:30|unique:products,product_code',
            'product_name' => 'required|string|max:150',
            'category_id' => 'required|integer|exists:categories,category_id',
            'supplier_id' => 'required|integer|exists:suppliers,supplier_id',
            'unit_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
        ]);

        $product = Product::create($request->all());
        $product->load(['category', 'supplier']);

        return response()->json($product, 201);
    }

    public function show(int $id)
    {
        $product = Product::with(['category', 'supplier'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, int $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'product_code' => "required|string|max:30|unique:products,product_code,{$id},product_id",
            'product_name' => 'required|string|max:150',
            'category_id' => 'required|integer|exists:categories,category_id',
            'supplier_id' => 'required|integer|exists:suppliers,supplier_id',
            'unit_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'reorder_level' => 'required|integer|min:0',
        ]);

        $product->update($request->all());
        $product->load(['category', 'supplier']);

        return response()->json($product);
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
