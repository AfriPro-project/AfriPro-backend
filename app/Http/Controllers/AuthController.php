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
        $fields = $request->validate([
            'first_name' => 'required|string',
            'last_name'=> 'required|string',
            'email'=>'required|string|unique:users,email',
            'password'=>'required|string|confirmed',
            'phone_number'=>'required|string',
            'phone_number_prefix'=>'required|string',
            'user_type'=>'required|string'
        ]);

        $user = User::create([
            'first_name' => $fields['first_name'],
            'last_name'=> $fields['last_name'],
            'email'=>$fields['email'],
            'password'=> md5($fields['password']),
            'phone_number'=>$fields['phone_number'],
            'phone_number_prefix'=>$fields['phone_number_prefix'],
            'user_type'=>$fields['user_type']
        ]);

        $token = $user->createToken('userToken')->plainTextToken;


        $response = [
            'status'=>'success',
            'user'=>$user,
            'token'=>$token
        ];


        $verificationToken = new VerificationTokensController();
        $verificationToken->store($fields,$token);
        $this->sendVerificationEmail($fields,$token);
        return response($response, 200);
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
            if($user->email_verified_at != null){
                $response = [
                    'status'=>'success',
                    'user'=>$user,
                    'token'=>$token
                ];
                return response($response, 200);
            }else{
                $response = [
                    'status'=>'error',
                    'message'=>'verify email'
                ];
                $verificationToken = new VerificationTokensController();
                $verificationToken->store($user,$token);
                $this->sendVerificationEmail($user,$token);
                return response($response, 200);
            }
        }else{
            $response = [
                'status'=>'error',
                'message'=>'user not found'
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
                    'message'=>'reset password  mail sent'
                ];
                return response($response, 200);
        }else{
            $response = [
                'status'=>'error',
                'message'=>'user not found'
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
            <h3>Welcome to AfriPro.</h3>
            <p>Please Click here to verify your email <a href="'.$link.'">'.$link.'</a></p>',
        );

        $mailer = new Email(
            $template,
            $email_data,
            'Welcome to AfriPro',
            'noreply@afri.pro'
        );
        $mailer->send();
    }
}
