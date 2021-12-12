<?php

namespace App\Http\Controllers;

use App\Models\promotionUsers;
use App\Models\ReferralCodes;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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
        $referralCodes = ReferralCodes::where('referral_codes.id','!=','')
        ->select(DB::raw("concat(users.first_name,' ',users.last_name) as name"),'referral_codes.referral_code',DB::raw('date_format(referral_codes.created_at, \'%d-%b-%Y\') as date_added'),'referral_codes.id','users.id as user_id','users.user_type')
        ->join('users','referral_codes.user_id','users.id')
        ->orderBy('referral_codes.id','desc')->get();

        foreach ($referralCodes as $code) {
            $code['usage_count'] = User::where('referred_by',$code->id)->get()->count();
            if($code['user_id'] == 2){
                $code['name'] = 'Admin';
            }
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
     * @return \Illuminate\Http\Response
     * @param  \Illuminate\Http\Request  $request
     */
    public function show(Request $request)
    {
        $referralCode = ReferralCodes::find($request->id);
        return $referralCode;
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
        return $referralCode;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $referralCode = ReferralCodes::find($request->id);
        $referralCode->delete();
        return ['status'=>"succes",'message','deleted'];
    }


    public function earlyBirdSignup(Request $request){
        $user = PromotionUsers::where('email',$request->email)->get()->first();
        if($user){
            $subscription = new SubscriptionController();
            $request->only(['user_id', 'service_id','code_type']);
            $subscription->subscribeUser($request);
            $user->delete();
        }
    }

    public function addCustomReferralCode(Request $request){
        //check if referral code already exist
        $code = ReferralCodes::where('referral_code',strtoupper($request->referral_code))->get()->first();
        if($code){
            return   ['status'=>"error",'message'=>'Referral Code Already Exist'];
        }
        $request['referral_code'] = strtoupper($request['referral_code']);
        $request['user_id'] = auth()->user()->id;
        $referralCode = ReferralCodes::create($request->all());
        return $referralCode;
    }
    public function updateCode(Request $request){
        //check if referral code already exist
        $code = ReferralCodes::where('referral_code',strtoupper($request->referral_code))
        ->where('id','!=',$request->id)
        ->get()->first();
        if($code){
            return   ['status'=>"error",'message'=>'Referral Code Already Exist'];
        }
        $referralCode = ReferralCodes::find($request->id);
        $referralCode->update($request->all());
        return $referralCode;
    }

    public function getReferralUsageCount(Request $request){


       $paidUsers = array();
       $normalUsers = array();

       $referralCode = ReferralCodes::find($request->id);

       for ($i=0; $i < 12; $i++) {
            $paidCount = User::where('users.referred_by',$request->id)
            ->join('subscriptions','users.id','subscriptions.user_id')
            ->where('subscriptions.expiry','>=',date('Y-m-d'))
            ->whereYear('subscriptions.created_at',date('Y'))
            ->whereMonth('subscriptions.created_at',$i+1)
            ->get()->count();

            $normalUsersCount = User::whereYear('created_at',date('Y'))
            ->where('referred_by',$request->id)
            ->whereMonth('created_at',$i+1)
            ->get()->count();

            $normal = ($normalUsersCount - $paidCount) < 0 ? 0 : $normalUsersCount - $paidCount;
            array_push($normalUsers, $normal);

            array_push($paidUsers,$paidCount);
       }
       $response = [
           'status'=>'success',
           'referral_code'=>$referralCode->referral_code,
            'data'=>[
                "paidUsers"=>$paidUsers,
                "normalUsers"=>$normalUsers
            ]
       ];

       return $response;
    }
}
