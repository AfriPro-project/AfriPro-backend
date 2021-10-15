<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlayerBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('player_bios', function (Blueprint $table) {
            $table->id();
            $table->integer('player_id');
            $table->date('date_of_birth');
            $table->string('citizenship');
            $table->string('current_country');
            $table->string('city');
            $table->string('primary_position');
            $table->string('secondary_position');
            $table->string('height_cm');
            $table->string('preferred_foot');
            $table->string('contract_status');
            $table->string('playing_level');
            $table->string('languages_spoken');
            $table->string('is_looking_for_club');
            $table->string('is_looking_for_an_angent');
            $table->string('transfermarket_link');
            $table->string('youtube_link');
            $table->string('cv_document');
            $table->string('school_transcript_document');
            $table->text('skill_set');
            $table->text('pictures');
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
        Schema::dropIfExists('player_bios');
    }
}
