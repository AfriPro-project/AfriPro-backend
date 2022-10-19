<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerBio extends Model
{
    use HasFactory;

    protected $fillable = [
        "player_id",
        "date_of_birth",
        "citizenship",
        "current_country",
        "city",
        "primary_position",
        "secondary_position",
        "height_cm",
        "preferred_foot",
        "contract_status",
        "team_name",
        "playing_level",
        "languages_spoken",
        "is_looking_for_club",
        "is_looking_for_an_angent",
        "transfermarket_link",
        "youtube_link",
        "youtube_link1",
        "youtube_link2",
        "cv_document",
        "school_transcript_document",
        "skill_set",
        "pictures",
        "agent_name",
        "agent_email",
        "agent_contact",
        "agent_contact_prefix",
        "agent_country_code"
    ];
}
