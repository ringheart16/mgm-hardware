<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $query = Supplier::withCount('products');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('supplier_name', 'like', "%{$search}%")
                  ->orWhere('contact_person', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_name' => 'required|string|max:150',
            'contact_person' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
        ]);

        $supplier = Supplier::create($request->all());
        return response()->json($supplier, 201);
    }

    public function show(int $id)
    {
        $supplier = Supplier::withCount('products')->findOrFail($id);
        return response()->json($supplier);
    }

    public function update(Request $request, int $id)
    {
        $supplier = Supplier::findOrFail($id);

        $request->validate([
            'supplier_name' => 'required|string|max:150',
            'contact_person' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'address' => 'nullable|string|max:255',
        ]);

        $supplier->update($request->all());
        return response()->json($supplier);
    }

    public function destroy(int $id)
    {
        $supplier = Supplier::findOrFail($id);

        if ($supplier->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete supplier with associated products.'
            ], 422);
        }

        $supplier->delete();
        return response()->json(['message' => 'Supplier deleted successfully']);
    }
}
