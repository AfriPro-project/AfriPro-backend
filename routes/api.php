<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PlayerBioController;

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
    Route::post('/save_player_bio',[PlayerBioController::class,'store']);
    Route::post('/update_player_bio',[PlayerBioController::class,'update']);
    Route::post('/get_player_bio',[PlayerBioController::class,'show']);
    // Route::post('email/verification-notification',[EmailVerificationController::class,'sendVerificationEmail']);
});
