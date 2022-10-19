<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddYoutubeLink2ToPlayerBiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('player_bios', function (Blueprint $table) {
            //
            $table->string('youtube_link2')->after('youtube_link1')->nullable();
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
            //
            $table->dropColumn('youtube_link2');
        });
    }
}
