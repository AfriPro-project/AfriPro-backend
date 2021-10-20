<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scholars extends Model
{
    use HasFactory;
    protected $fillable = [
        "player_id",
        "academicLevel",
        "isParentalConsent",
        "isContactParents",
        "whoCanGiveConsent"
    ];
}
