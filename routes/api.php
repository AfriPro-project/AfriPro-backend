<?php

use App\Http\Controllers\AgentBioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\OpportunitiesController;
use App\Http\Controllers\PlayerBioController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\TeamBioController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ScholarsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VerificationDocsController;
use App\Models\VerificationDocs;

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

     //services
     Route::post('/create_service',[ServicesController::class,'store']);
     Route::post('/payment_link/create_invoice', [PaymentController::class,'createInvoice']);


     Route::post('/get_subscription',[SubscriptionController::class,'show']);

     Route::post('/apply_to_scholarship',[ScholarsController::class,'store']);

     Route::post('/save_verification_docs',[VerificationDocsController::class,'store']);
     Route::post('/update_verification_docs',[VerificationDocsController::class,'update']);
     Route::post('/get_verification_docs',[VerificationDocsController::class,'show']);

     Route::post('/save_opportunity',[OpportunitiesController::class,'store']);
     Route::post('/update_opportunity',[OpportunitiesController::class,'update']);
     Route::post('/delete_opportunity',[OpportunitiesController::class,'destroy']);
     Route::post('/show_opportunity',[OpportunitiesController::class,'show']);

     Route::post('/upload_file',[FileUploadController::class,'store']);
     Route::post('/update_file',[FileUploadController::class,'update']);
    // Route::post('email/verification-notification',[EmailVerificationController::class,'sendVerificationEmail']);
});
