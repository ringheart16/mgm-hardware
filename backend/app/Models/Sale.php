<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sales';
    protected $primaryKey = 'sale_id';
    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'employee_id',
        'sale_date',
        'total_amount',
        'status',
        'payment_status',
    ];

    protected function casts(): array
    {
        return [
            'total_amount' => 'decimal:2',
            'sale_date' => 'date',
        ];
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'customer_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function details()
    {
        return $this->hasMany(SaleDetail::class, 'sale_id', 'sale_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'sale_id', 'sale_id');
    }
}
