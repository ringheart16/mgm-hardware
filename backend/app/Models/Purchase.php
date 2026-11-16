<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $table = 'purchases';
    protected $primaryKey = 'purchase_id';
    public $timestamps = false;

    protected $fillable = [
        'supplier_id',
        'employee_id',
        'purchase_date',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'purchase_date' => 'date',
        ];
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function details()
    {
        return $this->hasMany(PurchaseDetail::class, 'purchase_id', 'purchase_id');
    }
}
