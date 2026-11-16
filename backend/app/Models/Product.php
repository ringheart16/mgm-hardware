<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'product_id';
    public $timestamps = false;

    protected $fillable = [
        'product_code',
        'product_name',
        'category_id',
        'supplier_id',
        'unit_price',
        'stock_quantity',
        'reorder_level',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'reorder_level' => 'integer',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class, 'product_id', 'product_id');
    }

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetail::class, 'product_id', 'product_id');
    }

    public function isLowStock(): bool
    {
        return $this->stock_quantity <= $this->reorder_level && $this->stock_quantity > 0;
    }

    public function isOutOfStock(): bool
    {
        return $this->stock_quantity <= 0;
    }
}
