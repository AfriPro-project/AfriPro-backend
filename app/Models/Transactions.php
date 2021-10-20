<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;
    protected $fillable = [
        "service_id",
        'transaction_ref',
        'status',
        'user_id'
    ];
}
