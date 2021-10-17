<?php

use App\Http\Controllers\AgentBioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\PlayerBioController;
use App\Http\Controllers\TeamBioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//public routes
Route::post('/register',[AuthController::class,'register']);
Route::post('/login',[AuthController::class,'login']);
Route::post('/forgotPassword',[AuthController::class,'forgotPassword']);
Route::post('/resetpassword',[AuthController::class,'resetpassword']);


//protected routes
Route::group(['middleware'=>['auth:sanctum']],function(){
    //player bio
    Route::post('/save_player_bio',[PlayerBioController::class,'store']);
    Route::post('/update_player_bio',[PlayerBioController::class,'update']);
    Route::post('/get_player_bio',[PlayerBioController::class,'show']);

    //agent bio
    Route::post('/save_agent_bio',[AgentBioController::class,'store']);
    Route::post('/update_agent_bio',[AgentBioController::class,'update']);
    Route::post('/get_agent_bio',[AgentBioController::class,'show']);

     //team bio
     Route::post('/save_team_bio',[TeamBioController::class,'store']);
     Route::post('/update_team_bio',[TeamBioController::class,'update']);
     Route::post('/get_team_bio',[TeamBioController::class,'show']);

    Route::post('/upload_file',[FileUploadController::class,'store']);
    // Route::post('email/verification-notification',[EmailVerificationController::class,'sendVerificationEmail']);
});
