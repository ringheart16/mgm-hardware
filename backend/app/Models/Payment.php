<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    public $timestamps = false;

    protected $fillable = [
        'sale_id',
        'payment_method',
        'reference_number',
        'amount_paid',
        'change_amount',
        'payment_date',
        'received_by',
    ];

    protected function casts(): array
    {
        return [
            'amount_paid' => 'decimal:2',
            'change_amount' => 'decimal:2',
            'payment_date' => 'datetime',
        ];
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id', 'sale_id');
    }

    public function receivedByUser()
    {
        return $this->belongsTo(User::class, 'received_by', 'user_id');
    }
}
