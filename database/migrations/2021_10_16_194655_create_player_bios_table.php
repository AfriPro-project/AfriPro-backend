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
            $table->date('date_of_birth')->nullable();
            $table->string('citizenship')->nullable();
            $table->string('current_country')->nullable();
            $table->string('city')->nullable();
            $table->string('primary_position')->nullable();
            $table->string('secondary_position')->nullable();
            $table->string('height_cm')->nullable();
            $table->string('preferred_foot')->nullable();
            $table->string('contract_status')->nullable();
            $table->string('playing_level')->nullable();
            $table->string('languages_spoken')->nullable();
            $table->string('is_looking_for_club')->nullable();
            $table->string('is_looking_for_an_angent')->nullable();
            $table->string('transfermarket_link')->nullable();
            $table->string('youtube_link')->nullable();
            $table->string('cv_document')->nullable();
            $table->string('school_transcript_document')->nullable();
            $table->text('skill_set')->nullable();
            $table->text('pictures')->nullable();
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
