<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Verification_tokens extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'token',
        'expiration'
    ];
}
