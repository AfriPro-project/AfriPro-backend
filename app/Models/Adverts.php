<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Adverts extends Model
{
    use HasFactory;
    protected $fillable = [
        "title",
        'sponsor_image',
        "sponsor_name",
        "ad_url",
        "expiry_date",
        "rank",
        "clicks",
        "status"
    ];
}
