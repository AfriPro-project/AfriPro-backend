<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('phone_number_prefix')->nullable();
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable();
            $table->string('user_type');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('blocked');
            $table->string('referral_code');
            $table->string('referred_by')->nullable();
            $table->text('agent')->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
