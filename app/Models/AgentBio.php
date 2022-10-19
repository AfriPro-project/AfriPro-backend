<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentBio extends Model
{
    use HasFactory;
    protected $fillable = [
        "agent_id",
        "agent_email",
        'country_located',
        "country_license",
        "certified_by_fifa",
        "number_of_players_to_register",
        "is_mandate_for_players"
    ];
}
