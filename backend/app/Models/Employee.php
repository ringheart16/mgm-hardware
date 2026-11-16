<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $table = 'employees';
    protected $primaryKey = 'employee_id';
    public $timestamps = false;

    protected $fillable = [
        'first_name',
        'last_name',
        'position',
        'department',
        'phone',
        'email',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'employee_id', 'employee_id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class, 'employee_id', 'employee_id');
    }

    public function purchases()
    {
        return $this->hasMany(Purchase::class, 'employee_id', 'employee_id');
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
