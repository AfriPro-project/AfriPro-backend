<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\VerificationTokensController;
use App\Classes\Email;
use Carbon\Carbon;
use App\Models\Verification_tokens;

class AuthController extends Controller
{
    public function register(Request $request){
        //check if user was referred by someone
        $userFound = User::where('referral_code',$request->referred_by)->first();
        if(!$userFound){
            $request->referred_by = '';
        }

        //check if user exist
        if($request->email  !=''){
            $userFoundByEmail  = User::where('email','=',$request->email);
            if($userFoundByEmail){
                return response(['failed'],302);
            }
            $request['blocked'] = 'false';
        }else{
            $request['blocked'] = 'true';
        }

        $referralCodeInstance = new ReferralCodesController();
        $referralCode = $referralCodeInstance->store($request);

        $request['password'] = md5($request->password);
        $user = User::create($request->all());

        $referralCodeInstance->update($user->id,$referralCode);

        if($request->email != ''){
            $token = $user->createToken('userToken')->plainTextToken;
            $response = [
                'status'=>'success',
                'user'=>$user,
                'token'=>$token
            ];

            $verificationToken = new VerificationTokensController();
            $verificationToken->store($request,$token);
            $this->sendVerificationEmail($request,$token);
            $this->sendWelcomeEmail($request);
            return response($response, 200);
        }else{
            return $user;
        }

    }

    public function login(Request $request){
        $loginData = $request->validate([
            'email' => 'email|required',
            'password' => 'required'
        ]);

        // return ($loginData['email']);
        $password = md5($loginData['password']);
        $user = User::where('email',$loginData['email'])->where('password',$password)->first();
        if($user){
            $token = $user->createToken('userToken')->plainTextToken;
            if($user->blocked == 'true'){
                $response = [
                    'status'=>'error',
                    'message'=>'Sorry!, your account has been suspended, please contact our support team for assistance.'
                ];
                return response($response, 200);
            }
            $response = [
                'status'=>'success',
                'user'=>$user,
                'token'=>$token
            ];
            return response($response, 200);

        }else{
            $response = [
                'status'=>'error',
                'message'=>'Sorry!, you provided the wrong email and password. Please try again.'
            ];
            return response($response, 200);
        }
    }

    public function forgotPassword(Request $request){
        $fields = $request->validate([
            'email' => 'email|required',
        ]);
        $user = User::where('email',$fields['email'])->first();
        if($user){
                $token = $user->createToken('userToken')->plainTextToken;

                // send email with the template
                $template = 'emails.email_template';
                $link = env('APP_URL').":".env('PORT').'/forgot_password/'.$fields['email'].'/'.$token;
                // email data

                $email_data = array(
                    'email' => $user['email'],
                    'name'=>$user['first_name'],
                    'title' => 'Reset Password',
                    'body' => '<p> Hello <b>'.$user['first_name'].'</b>,</p>
                    <p>You requested for a password reset</p>
                    <p>Please Click here to reset your password <a href="'.$link.'">'.$link.'</a></p>',
                );

                $mailer = new Email(
                    $template,
                    $email_data,
                    'Password Reset',
                    'noreply@afri.pro'
                );
                $verificationToken = new VerificationTokensController();
                $verificationToken->store($user,$token);
                $mailer->send();
                $response = [
                    'status'=>'sucess',
                    'message'=>'We just sent you a reset password link to your email'
                ];
                return response($response, 200);
        }else{
            $response = [
                'status'=>'error',
                'message'=>'Oops!, we couldn\'t find your email address'
            ];
            return response($response, 200);
        }
    }

    public function forgotPasswordView(Request $request){
            //check if the token is valid
            $current_time = Carbon::now()->toDateTimeString();
            $token = Verification_tokens::where('email',$request->email)->where('token',$request->token)->where('expiration','>=',$current_time)->first();
            if($token){
                $user = User::where('email',$request->email);
                $user->update([
                    'email_verified_at'=>$current_time
                ]);
                $data = array(
                    "email"=>$request->email,
                );
                $verificationToken = new VerificationTokensController();
                $verificationToken->destroy($token->id);
                return view('reset_password_view',$data);
            }else{
                $data = array(
                    "alert"=>"failed",
                    "message"=>"Oops!, the resource you are looking for is not available"
                );
                return view('email_verification_view',$data);
            }
    }

    public function resetpassword(Request $request){
        $fields = $request->validate([
            'email' => 'email|required',
            'password'=>'string|required'
        ]);
        $user = User::where('email',$fields['email'])->first();

        $password  = md5($fields['password']);

        $user->update([
            'password'=>$password
        ]);



        // send email with the template
        $template = 'emails.email_template';
        // email data

        $email_data = array(
            'email' => $user['email'],
            'name'=>$user['first_name'],
            'title' => 'Reset Password',
            'body' => '<p> Hello <b>'.$user['first_name'].'</b>,</p>
            <p>Your password has been updated</p>',
        );

        $mailer = new Email(
            $template,
            $email_data,
            'Password Updated',
            'noreply@afri.pro'
        );

        $mailer->send();

        $response = [
            'status'=>'success',
            'message'=>'password updated'
        ];
        return response($response, 200);
    }

    public function sendVerificationEmail($fields, $token){

        // send email with the template
        $template = 'emails.email_template';
        $link = env('APP_URL').":".env('PORT').'/veiry_email/'.$fields['email'].'/'.$token;
        // email data

        $email_data = array(
            'email' => $fields['email'],
            'name'=>$fields['first_name'],
            'title' => 'Verify Email',
            'body' => '<p> Hello <b>'.$fields['first_name'].'</b>,</p>
            <p>Please Click here to verify your email <a href="'.$link.'">'.$link.'</a></p>',
        );

        $mailer = new Email(
            $template,
            $email_data,
            'Verify your email',
            'noreply@afri.pro'
        );
        $mailer->send();
    }


    public function sendWelcomeEmail($fields){

        // send email with the template
        $template = 'emails.email_template';
        // email data

        $email_data = array(
            'email' => $fields['email'],
            'name'=>$fields['first_name'],
            'title' => 'Welcome to AfriPro',
            'body' => '
            Hello baller,<br/>
            Welcome to AfriPro, " The Gateway to Stardom ".<br/>
            We at AfriPro delighted to have you join us and we hope to do our best to take you to the next level. Remember to follow our Instagram account @afripro.afripro .<br/>
            Thank you ⚽️🤝'
        );

        $mailer = new Email(
            $template,
            $email_data,
            'Welcome to AfriPro',
            'noreply@afri.pro'
        );
        $mailer->send();
    }

    public function updateProfile(Request $request){
        $user = User::find($request->user_id);
        $user->update($request->all());
        $token = $request->bearerToken();
        $response = [
            'status'=>'success',
            'user'=>$user,
            'token'=>$token
        ];
        return $response;
    }

    public function updatePassword(Request $request){
        $user = User::find($request->user_id);
        if($user->password != md5($request->old_password)) return ['status'=>'failed'];
        $password = md5($request->new_password);
        $user->update(['password'=>$password]);
        return ['status'=>'done'];
    }

    public function anonymousLogin(Request $request){
        $user = User::find($request->user_id);
        $token = $user->createToken('userToken')->plainTextToken;
        $response = [
            'status'=>'success',
            'user'=>$user,
            'token'=>$token
        ];
        return $response;
    }
}
