<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddToPlayerBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('player_bios', function (Blueprint $table) {
            $table->string('agent_name')->nullable();
            $table->string('agent_contact')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('player_bios', function (Blueprint $table) {
            $table->dropColumn('agent_name');
            $table->dropColumn('agent_contact');
        });
    }
}
