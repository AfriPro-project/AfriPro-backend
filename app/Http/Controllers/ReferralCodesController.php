<?php

namespace App\Http\Controllers;

use App\Models\ReferralCodes;
use App\Models\User;
use Illuminate\Http\Request;

class ReferralCodesController extends Controller
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
    public function store($fields)
    {
        $users = User::where('first_name','!=','')->get();
        $number = sizeof($users) > 0 ? $users[sizeof(($users))-1]['id'] : 0;
        //generate referral code
        $referralCode = substr($fields['first_name'],0,3).''.$number.''.substr($fields['phone_number'],strlen($fields['phone_number'])-3,strlen($fields['phone_number']));
        $referralCode = strtoupper($referralCode);
        ReferralCodes::create([
            'user_id'=>0,
            'referral_code'=>$referralCode
        ]);

        return $referralCode;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id,$code)
    {
        $referralCode = ReferralCodes::where('referral_code','=',$code)->first();
        $referralCode->update(['user_id'=>$id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
