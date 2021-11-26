<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriptions;
use App\Models\User;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    function show(Request $request){
        $today = Carbon::now();
        $subscription = Subscriptions::where('user_id','=',$request->user_id)->where('expiry','>=',$today)->get();
        return $subscription;
    }

    function cancelSubscription(Request $request){
        $user = User::find($request->user_id);
        if($request->user_type  == 'player'){
            if($user->agent != null){
                $user->update(['blocked'=>'true']);
            }
        }
        $subscription = Subscriptions::where('service_id',$request->service_id)
        ->where('user_id',$request->user_id)->get()->first();
        $subscription->delete();

        //send notification to user
        $notifcationsController = new NotificationsController();


        //structure notification
        $request['route'] = '/subscription';
        $request['status'] = 'new';
        $request['user_id'] = $user->id;
        $request['message']  = 'Your subscription has been cancelled';
        $request->only(['message', 'route', 'status','user_id']);
        $notifcationsController->store($request);
        return ['status'=>'success','message'=>'done'];
    }


    public function subscribeUser(Request $request){
        $user = User::find($request->user_id);

        unset($request->user_type);
        $expiration = Carbon::now();
        $transaction = array();
        $transaction['service_id']= $request->service_id;
        $transaction = json_decode(json_encode($transaction));

        $calculateExpirty = new PaymentController();

        $expirationFunc = $calculateExpirty->getExpiration($transaction, $user,$expiration);
        $request['expiry'] = $expirationFunc;
        Subscriptions::create($request->all());

        //send notification to user
        $notifcationsController = new NotificationsController();

       if($request->service_id == 2 || $user->user_type == 'agent'){
         if($request->code_type){
            $request['message'] ='The '.$request->code_type.' promo has been activated on your account and will expire on '.date('d M, Y',strtotime($expirationFunc));
         }else{
            $request['message'] ='Your premium subscription has been activated and will expire on '.date('d M, Y',strtotime($expirationFunc));
         }
       }else{
        $request['message'] = "Your Basic subscription has been activated and will expre on ".date('d M, Y',strtotime($expirationFunc));
       }



        //structure notification
        $request['route'] = '/subscription';
        $request['status'] = 'new';
        $request['user_id'] = $user->id;
        $request->only(['message', 'route', 'status','user_id']);
        $notifcationsController->store($request);
        return ['status'=>'success','message'=>'done'];
    }
}
