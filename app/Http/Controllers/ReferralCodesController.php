<?php

namespace App\Http\Controllers;

use App\Models\ReferralCodes;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReferralCodesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $referralCodes = ReferralCodes::where('referral_codes.id','!=','')
        ->select(DB::raw("concat(users.first_name,' ',users.last_name) as name"),'referral_codes.referral_code',DB::raw('date_format(referral_codes.created_at, \'%d-%b-%Y\') as date_added'),'referral_codes.id','users.id as user_id','users.user_type')
        ->join('users','referral_codes.user_id','users.id')
        ->orderBy('referral_codes.id','desc')->get();

        foreach ($referralCodes as $code) {
            $code['usage_count'] = User::where('referred_by',$code->referral_code)->get()->count();
        }

        return $referralCodes;
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
        $pNumber = substr($fields['phone_number'],strlen($fields['phone_number'])-3,strlen($fields['phone_number']));
        if($fields['phone_number'] == 'N/A'){
            $pNumber = date('d').''.date('i');
        }
        $referralCode = substr($fields['first_name'],0,3).''.$number.''.$pNumber;
        $referralCode = strtoupper($referralCode);
        ReferralCodes::create([
            'user_id'=>0,
            'referral_code'=>$referralCode,
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
