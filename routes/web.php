<?php

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationTokensController;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/veiry_email/{email}/{token}',[VerificationTokensController::class, 'verify']);
Route::get('/forgot_password/{email}/{token}',[AuthController::class, 'forgotPasswordView']);
Route::get('/verify_transaction',[PaymentController::class, 'verifyTransaction']);


// Route::get('/email', function () {
//      // email data
//      $email_data = array(
//         'title' => 'Verify Email',
//         'body' => '<p> Hello <b>{{ $name }}</b>,</p>

//         <h3>Welcome to AfriPro.</h3>

//         <p>Please Click here to verify your email <a href="{{ $link }}">{{ $link }}</a></p>',
//     );

//     // send email with the template
//     $template = 'emails.welcome_email';
//     $mailer = new Email(
//         $template,
//         $email_data,
//         'Welcome to AfriPro',
//         'noreaply@afri.pro'
//     );
//     $mailer->send();
//     return view('emails.welcome_email',$email_data);
// });
