<?php

use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\AdvertsController;
use App\Http\Controllers\AgentBioController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatRoomsController;
use App\Http\Controllers\EventsAttendeesController;
use App\Http\Controllers\EventsController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\OpportunitiesAppliedByController;
use App\Http\Controllers\OpportunitiesController;
use App\Http\Controllers\PlayerBioController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\TeamBioController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PushNotifcationsController;
use App\Http\Controllers\ScholarsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\VerificationDocsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReferralCodesController;

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
Route::post('/anonymous_login',[AuthController::class,'anonymousLogin']);


//protected routes
Route::group(['middleware'=>['auth:sanctum']],function(){

    Route::get('/players/{player_id}',[PlayerBioController::class,'showBioOnly']);
    Route::get('/agents/{agent_id}',[AgentBioController::class,'showBioOnly']);
    Route::get('/teams/{club_official_id}',[TeamBioController::class,'showBioOnly']);
    Route::get('/players',[PlayerBioController::class,'showAll']);

    //update user basic info
    Route::post('/update_registration',[AuthController::class,'updateProfile']);
    Route::post('/update_password',[AuthController::class,'updatePassword']);

    //player bio
    Route::post('/save_player_bio',[PlayerBioController::class,'store']);
    Route::post('/update_player_bio',[PlayerBioController::class,'update']);
    Route::post('/toggle_blocked',[PlayerBioController::class,'toggleBlocked']);



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

     Route::get('/opportunities/{id}/{user_id}',[OpportunitiesController::class,'show']);
     Route::post('/save_opportunity',[OpportunitiesController::class,'store']);
     Route::post('/update_opportunity',[OpportunitiesController::class,'update']);
     Route::post('/delete_opportunity',[OpportunitiesController::class,'destroy']);
     Route::post('/apply_opportunity',[OpportunitiesAppliedByController::class,'store']);
     Route::get('/opportunities',[OpportunitiesController::class,'showAll']);

    Route::get('/players/{player_id}/{user_id}',[PlayerBioController::class,'show']);
    Route::post('/events',[EventsController::class,'store']);
    Route::get('/events/{id}',[EventsController::class,'show']);
    Route::post('/attend_event',[EventsAttendeesController::class,'store']);



    Route::get('/adverts',[AdvertsController::class,'showAll']);
    Route::post('/adverts_update_clicks',[AdvertsController::class,'increaseClicks']);
    Route::get('/events',[EventsController::class,'showAll']);


    Route::post('/upload_file',[FileUploadController::class,'store']);
    Route::post('/update_file',[FileUploadController::class,'update']);

    //ChatRooms
    Route::post('/chatrooms',[ChatRoomsController::class,'createChatRoom']);
    Route::post('/chatrooms/update',[ChatRoomsController::class,'updateChatRoomName']);
    Route::post('/chatrooms/join/',[ChatRoomsController::class,'joinChatRoom']);
    Route::post('/chatrooms/messages',[ChatRoomsController::class,'sendMessage']);
    Route::get('/chatrooms/messages/latest',[ChatRoomsController::class,'getLatestMessages']);
    Route::get('/chatrooms/messages/{room_id}',[ChatRoomsController::class,'getRoomMessages']);
    Route::post('/chatrooms/toggleMute',[ChatRoomsController::class,'toggleMute']);
    Route::post('/chatrooms/leave',[ChatRoomsController::class,'leaveRoom']);
    Route::post('/chatrooms/messages/delete',[ChatRoomsController::class,'deleteMessage']);
    Route::get('/chatrooms/{room_id}/members',[ChatRoomsController::class,'getRoomMembers']);


    //notifications
    Route::post('/notifications',[NotificationsController::class,'store']);
    Route::post('/notifications/update',[NotificationsController::class,'update']);
    Route::post('/notifications/delete',[NotificationsController::class,'destroy']);
    Route::get('/notifications',[NotificationsController::class,'show']);
    Route::post('/notifications/topic',[PushNotifcationsController::class,'subscribeToTopic']);


    //admin routes
    Route::get('/dashboard',[DashboardController::class,'fetchDashboardStat'])->middleware('admin');
    Route::get('/users',[AuthController::class,'getAllUsers'])->middleware('admin');
    Route::get('/opportunities/admin',[OpportunitiesController::class,'getAdminOpportunities'])->middleware('admin');
    Route::post('/subscriptions/cancel',[SubscriptionController::class,'cancelSubscription'])->middleware('admin');
    Route::post('/subscriptions',[SubscriptionController::class,'subscribeUser'])->middleware('admin');
    Route::get('/verification_docs',[VerificationDocsController::class,'fetchVerificationDocs'])->middleware('admin');
    Route::post('/verification_docs/reject',[VerificationDocsController::class,'destroy'])->middleware('admin');
    Route::post('/verification_docs/verify',[VerificationDocsController::class,'verifyDocs'])->middleware('admin');
    Route::get('/verification_docs/{id}',[VerificationDocsController::class,'getVerificationDoc'])->middleware('admin');
    Route::get('/scholars',[ScholarsController::class,'getAll'])->middleware('admin');
    Route::post('/scholars/delete',[ScholarsController::class,'delete'])->middleware('admin');
    Route::get('/events_admin',[EventsController::class,'fetchEventsForAdmin'])->middleware('admin');
    Route::post('/events_delete',[EventsController::class,'destroy'])->middleware('admin');
    Route::post('/events_update',[EventsController::class,'update'])->middleware('admin');

    Route::post('/adverts_update',[AdvertsController::class,'update'])->middleware('admin');
    Route::post('/adverts_delete',[AdvertsController::class,'destroy'])->middleware('admin');
    Route::get('/adverts/{id}',[AdvertsController::class,'show'])->middleware('admin');
    Route::post('/adverts',[AdvertsController::class,'store'])->middleware('admin');
    Route::get('/adverts_admin',[AdvertsController::class,'fetchAdsAdmin'])->middleware('admin');
    Route::get('/messages/admin/{room_type}',[ChatRoomsController::class,'allMessages'])->middleware('admin');
    Route::post('/earlybird',[ReferralCodesController::class,'earlyBirdSignup'])->middleware('admin');
    Route::get('/activity_logs',[ActivityLogsController::class,'index'])->middleware('admin');
    Route::get('/services',[ServicesController::class,'getServicesForAdmin'])->middleware('admin');
    Route::post('/services/update',[ServicesController::class,'update'])->middleware('admin');
    Route::post('/referral_codes/show',[ReferralCodesController::class,'show'])->middleware('admin');
    Route::post('/referral_codes/addCustom',[ReferralCodesController::class,'addCustomReferralCode'])->middleware('admin');
    Route::get('/referral_codes',[ReferralCodesController::class,'index'])->middleware('admin');
    Route::post('/referral_codes/updateCode',[ReferralCodesController::class,'updateCode'])->middleware('admin');
    Route::post('/referral_codes/usageCounts',[ReferralCodesController::class,'getReferralUsageCount'])->middleware('admin');
    Route::post('/delete_referral_code',[ReferralCodesController::class,'destroy'])->middleware('admin');



    Route::get('header_token', function() {
        return response()->json(['status' =>'error', 'msg' => 'Unathorized as Admin']);
    })->name('header_token');

    // Route::post('email/verification-notification',[EmailVerificationController::class,'sendVerificationEmail']);
});
