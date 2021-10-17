<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAgentBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('agent_bios', function (Blueprint $table) {
            $table->id();
            $table->integer('agent_id');
            $table->string('country_located')->nullable();
            $table->string('country_license')->nullable();
            $table->string('certified_by_fifa')->nullable();
            $table->integer('number_of_players_to_register')->nullable();
            $table->string('is_mandate_for_players')->nullable();
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
        Schema::dropIfExists('agent_bios');
    }
}
