<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\VerificationTokensController;
use App\Classes\Email;
use App\Models\ReferralCodes;
use App\Models\TeamBio;
use Carbon\Carbon;
use App\Models\Verification_tokens;
use App\Models\Subscriptions;
use App\Http\Controllers\ActivityLogsController;
use App\Models\ProfileViews;

class AuthController extends Controller
{
    public function register(Request $request){
        if($request->admin){
            $request->password = '123456';
            unset($request->admin);
        }

        //get early bird signup code
        $code = '';
        if(strtoupper($request->referred_by) == 'EARLYBIRD'){
            $code = $request->referred_by;
        }

        //check if user was referred by someone
        $userFound = ReferralCodes::where('referral_code',$request->referred_by)->first();
        if(!$userFound){
            $request->referred_by = 0;
        }else{
            $userFound->id;
        }



        //check if user exist
        if($request->email  !=''){

            $userFoundByEmail  = User::where('email','=',$request->email)->get()->first();
            if($userFoundByEmail){
                $response = ['status'=>'error','message'=>'This email is alredy registered'];
                return response($response,200);
            }
            $request['blocked'] = 'false';
        }else{
            $request['blocked'] = 'true';
        }

        $referralCodeInstance = new ReferralCodesController();
        $referralCode = $referralCodeInstance->store($request);

        if($request->picuteres == null){
            $request['pictures'] = 'public/files/default_avatar.jpg';
        }

        $request['password'] = md5($request->password);
        $request['referral_code'] = $referralCode;

        $user = User::create($request->all());
        $referralCodeInstance->update($user->id,$referralCode);

        if($request->email != ''){
            $user['profile_views'] = $this->getProfileViews($user->id);
            $token = $user->createToken('userToken')->plainTextToken;
            $response = [
                'status'=>'success',
                'user'=>$user,
                'token'=>$token
            ];

            //activate early bird signup for user
            if($code != '' && $user->user_type != 'club_official'){
                $referralCode = new ReferralCodesController();
                $request['user_id'] = $user->id;
                $request['service_id'] = $user->user_type == 'agent' ? 1 : 2;
                $request['code_type'] = 'Early Bird';
                $request['email'] = $user->email;
                $referralCode->earlyBirdSignup($request);
            }


            $verificationToken = new VerificationTokensController();
            $verificationToken->store($request,$token);
            $this->sendVerificationEmail($request,$token);
            $request->admin = 'true';
            $this->sendWelcomeEmail($request);

            //insert into actvitylogs
            $c = $user->user_type ==  'agent' ? 'an' : 'a';

            $name = $user->first_name[0].'.'.$user->last_name;
            $message = "$user->id:$user->user_type:$name signup as $c $user->user_type";

            $this->insertActivityLog($user,$request,$message);
            return response($response, 200);
        }else{

            $agent = User::find($request->agent);
            $name = $agent->first_name[0].'.'.$agent->last_name;
            $name2 = $user->first_name[0].'.'.$user->last_name;
            $message = "$agent->id:$agent->user_type:$name onbaoarded  a new player $user->id:player:$name2";
            $this->insertActivityLog($agent,$request,$message);
            return $user;
        }

    }

    public function login(Request $request){
        $loginData = $request->validate([
            'email' => 'email|required',
            'password' => 'required',
            'type'=>'string'
        ]);

        $password = md5($loginData['password']);
        $user = User::where('email',$loginData['email'])->where('password',$password);

        if($request->type){
            $user=$user->where('user_type','admin');
        }
        $user = $user->first();

        if($user){
            $token = $user->createToken('userToken')->plainTextToken;
            $user = $this->getReferralCode($user);
            if($user->blocked == 'true'){
                $response = [
                    'status'=>'error',
                    'message'=>'Sorry!, your account has been suspended, please contact our support team for assistance.'
                ];
                return response($response, 200);
            }

            if($user->user_type == 'club_official'){
                $team = TeamBio::where('club_official_id',$user->id)->first();
                if($team->verified == null || $team->verified == "false"){
                    return $response = [
                        'status'=>'error',
                        'message'=>'Our Team will contact you soon to complete your registration. Thanks'
                    ];
                }
            }



            $user->update(['last_active'=>Carbon::now()->toDateTimeString()]);
            $user['profile_views'] = $this->getProfileViews($user->id);
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
                $link = env('APP_URL')."/forgot_password/".$fields['email'].'/'.$token;
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
                    'noreply@afripro.biztrustgh.com'
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
            'noreply@afripro.biztrustgh.com'
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
            'noreply@afripro.biztrustgh.com'
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

        if($fields->admin){
            $email_data['body'] .= 'Please find your credentials below<br/>
            <b>Email:</b> '.$fields['email'].'<br/>
            <b>Password:</b>12345
            ';
        }

        $mailer = new Email(
            $template,
            $email_data,
            'Welcome to AfriPro',
            'noreply@afripro.biztrustgh.com'
        );
        $mailer->send();
    }

    public function updateProfile(Request $request){
        $user = User::find($request->user_id);
        $user->update($request->all());
        $user = $this->getReferralCode($user);
        $token = $request->bearerToken();
        $response = [
            'status'=>'success',
            'user'=>$user,
            'token'=>$token
        ];
        if($request->first_name){
            $name = $user->first_name[0].'.'.$user->last_name;
            $message = "$user->id:$user->user_type:$name updated his/her profile";
            $this->insertActivityLog($user,$request,$message);
        }
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
        $user = $this->getReferralCode($user);
        $user['profile_views'] = $this->getProfileViews($user->id);
        $token = $user->createToken('userToken')->plainTextToken;
        $response = [
            'status'=>'success',
            'user'=>$user,
            'token'=>$token
        ];
        return $response;
    }

    public function getAllUsers(){
        $users = User::select('users.first_name','users.last_name','users.user_type','users.last_active','services.service_name','users.id as user_id','users.blocked','blocked')
        ->where('users.id','!=',auth()->user()->id)
        ->leftJoin('subscriptions','users.id','subscriptions.user_id')
        ->leftJoin('services','subscriptions.service_id','services.id')
        ->groupBy('users.id')
        ->orderBy('users.id','desc')
        ->get();

        $results = array();
        foreach ($users as $user) {
            $data = array();
            $data['name'] = $user->first_name.' '.$user->last_name;
            $data['role']=$user->user_type;
            $data['last_active']=$user->last_active;
            $data['id']=$user->user_id;

            $premiumSub = Subscriptions::Where('service_id',2)
            ->where('user_id',$user->user_id)->get()->first();
            if($premiumSub){
                $data['subscription'] = 'Premium';
            }else{
                $data['subscription'] = 'Basic';
            }

            if($user->service_name==null){
                $data['subscription'] = 'None';
            }
            $data['blocked'] = $user->blocked;


            array_push($results, $data);
        }

        return $results;
    }

    public function getReferralCode($user){
        if($user->referral_code == null){
            $user['referral_code'] = ReferralCodes::where('user_id',$user->id)->first()->referral_code;
        }
        return $user;
    }

    public function insertActivityLog($user,$request,$message){
        $activityLog  = new ActivityLogsController();
        $request['activity'] = $message;
        $request['user_id'] = $user->id;
        $request->only(['activity','user_id']);
        $activityLog->store($request);
    }

    public function getProfileViews($id){
        $views = ProfileViews::where('user_id',$id)->count();
        return $views;
    }
}
