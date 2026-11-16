<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:100|unique:categories,category_name',
            'description' => 'nullable|string|max:255',
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }

    public function show(int $id)
    {
        $category = Category::withCount('products')->findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, int $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'category_name' => "required|string|max:100|unique:categories,category_name,{$id},category_id",
            'description' => 'nullable|string|max:255',
        ]);

        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy(int $id)
    {
        $category = Category::findOrFail($id);

        if ($category->products()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete category with associated products.'
            ], 422);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
