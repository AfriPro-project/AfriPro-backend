<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Events extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "title",
        "venue",
        "about_event",
        "online_link",
        "start_date_time",
        "end_date_time",
        'banner',
    ];
}
