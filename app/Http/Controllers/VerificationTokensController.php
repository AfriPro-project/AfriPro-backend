<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Verification_tokens;
use Carbon\Carbon;

class VerificationTokensController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($fields,$token)
    {

        //check if user already has a token
        $fetch_token = Verification_tokens::where('email',$fields["email"]);
        $expiration = Carbon::now()->addMinutes(30)->toDateTimeString();
        if($fetch_token->first()){
            //update the token
            $this->update($fetch_token,$token,$expiration);
        }else{
            //create new token and send
            Verification_tokens::create([
                'email'=>$fields['email'],
                'token'=>$token,
                'expiration'=> $expiration
            ]);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function verify(Request $request)
    {
        $current_time = Carbon::now()->toDateTimeString();
        $token = Verification_tokens::where('email',$request->email)->where('token',$request->token)->where('expiration','>=',$current_time)->first();
        if($token){
            $user = User::where('email',$request->email);
            $user->update([
                'email_verified_at'=>$current_time
            ]);
            $data = array(
                "alert"=>"success",
                "message"=>"Your accout has been verified successfully, please return to our application and enjoy it's benefits"
            );
            $this->destroy($token->id);
            return view('email_verification_view',$data);
        }else{
            $data = array(
                "alert"=>"failed",
                "message"=>"Oops!, the resource you are looking for is not available"
            );
            return view('email_verification_view',$data);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($fetch_token,$token,$expiration)
    {
        $fetch_token->update([
            'token'=>$token,
            'expiration'=>$expiration
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Verification_tokens::destroy($id);
    }
}
