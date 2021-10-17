<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTeamBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('team_bios', function (Blueprint $table) {
            $table->id();
            $table->integer('club_official_id');
            $table->string('name_of_team')->nullable();
            $table->string('country_of_team')->nullable();
            $table->string('city_of_team')->nullable();
            $table->string('role_in_team')->nullable();
            $table->string('transfer_status_of_player')->nullable();
            $table->string('player_position_looking_for')->nullable();
            $table->string('is_to_make_quisition_in_next_twelve_month')->nullable();
            $table->string('is_assistenance_needed_in_african_transfer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('team_bios');
    }
}
