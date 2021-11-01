<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatRoomMessages extends Model
{
    use HasFactory;
    protected $fillable = [
        "sender_id",
        'room_id',
        'message',
        'type',
        'image',
        "read"
    ];
}
