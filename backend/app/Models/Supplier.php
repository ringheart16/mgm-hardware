<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';
    protected $primaryKey = 'supplier_id';
    public $timestamps = false;

    protected $fillable = [
        'supplier_name',
        'contact_person',
        'phone',
        'email',
        'address',
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id', 'supplier_id');
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'supplier_id', 'supplier_id');
    }
}
