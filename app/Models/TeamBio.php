<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamBio extends Model
{
    use HasFactory;
    protected $fillable = [
        "club_official_id",
        'name_of_team',
        "country_of_team",
        "city_of_team",
        "role_in_team",
        "transfer_status_of_player",
        "player_position_looking_for",
        "is_to_make_quisition_in_next_twelve_month",
        "is_assistenance_needed_in_african_transfer"
    ];
}
