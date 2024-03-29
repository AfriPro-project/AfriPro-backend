<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\ServicesController;
use App\Models\User;
use App\Models\Subscriptions;
use App\Models\Transactions;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use AmrShawky\LaravelCurrency\Facade\Currency;


class PaymentController extends Controller
{
    function createInvoice(Request $request){
        $servicesControllerInstance = new ServicesController();
        $service = $servicesControllerInstance->show($request->service_id);
        if($service){
            $user = User::where('id','=',$request->user_id)->get()->first();
            if($user){
                $service_amount = $user->user_type == 'player' ? $service->amount_for_player : $service->amount_for_agent;

                //check if agent is onboarding a player instead

                if($user->email == ""){
                    $agent =  User::where('id','=',$user->agent)->get()->first();
                    $user['email'] = $agent->email;
                    $service_amount = $service->amount_for_agent;
                }



                //Check if user has no active subscription for the selected service
                $subscription = Subscriptions::where('service_id','=',$request->service_id)->where('user_id','=',$request->user_id)->get()->first();
                    if($subscription){
                        $today = Carbon::now();;
                        $expiration = Carbon::createFromFormat('Y-m-d',$subscription->expiry);
                        $diff = $expiration->diff($today)->days;
                        if($diff > 4 && $expiration > $today){
                            $response = [
                                'status'=>'error',
                                'message'=>'You already have an active '.$service->service_name.'  subscription'
                            ];
                            return response($response, 200);
                        }
                    }
                    $transactions = Transactions::latest('id')->first();
                    $id = $transactions ? $transactions->id : 0;
                    $transaction_id = 'tx_ref_a'.$id.'|'.md5($id);

                    $json = json_decode(file_get_contents('http://www.geoplugin.net/json.gp?ip='. $this->getIp()), true);
                    $currency = $json['geoplugin_currencyCode'];
                    $amountToPay = Currency::convert()
                    ->from('EUR')
                    ->to($currency)
                    ->amount($service_amount)
                    ->get();
                     $amount = sprintf('%0.2f',$amountToPay);
                    //create a transaction
                    $email = $user->email;
                    $phone_number= $user->phone_number;
                    $name = $user->first_name.' '.$user->last_name;
                    if($user->agent != null){
                        $agent = User::find($user->agent);
                        $email = $agent->email;
                        $phone_number= $agent->phone_number;
                        $name = $agent->first_name.' '.$agent->last_name.' for '.$name;
                    }

                    Transactions::create([
                        "service_id"=>$service->id,
                        'transaction_ref'=>$transaction_id,
                        'status'=>'pending',
                        'user_id'=>$user->id
                    ]);
                    $data = [
                        "tx_ref" => $transaction_id,
                        "amount" => $amount,
                        "currency" => $currency,
                        "redirect_url" => env('APP_VERIFY_TRANSACTION_URL'),
                        "payment_options" => "card,mobilemoney",
                        "meta" => [
                              "consumer_id" => $user->id,
                              "consumer_mac" => "92a3-912ba-1192a"
                           ],
                        "customer" => [
                                 "email" => $email,
                                 "phonenumber" => $phone_number,
                                 "name" => $name
                              ],
                        "customizations" => [
                                    "title" => "Subscription",
                                    "description" => $service->service_name,
                                    "logo" => "https://api.afri.pro/backend/public/images/logo.png"
                                 ]
                     ];



                     $response = Http::withHeaders([
                        'Authorization' => 'Bearer '.env("API_SERVER_KEY").'',
                    ])->post('https://api.flutterwave.com/v3/payments',$data);

                     return $response->json();
                    //return view('payment_invoice',$data);

            }
        }else{
            $response = [
                'status'=>'error',
                'message'=>'Service not found'
            ];
            return response($response, 200);
        }

    }

    public function getExpiration($transaction,$user,$expiration){
        if($transaction->service_id == 2 && $user->user_type == 'player' && $user->password != null){
            //add premium plan to player
            $expiration->addMonth(1);
        }else if($transaction->service_id == 2 && $user->user_type == 'player' && $user->password == null){
            //add premium plan to onboarded player by agent
            $expiration->addYear(30);
        }else if($transaction->service_id == 1 && $user->user_type == 'agent'){
            //add 1 year agent plan
            $expiration->addYear(1);
        }else{
            $expiration->addYear(30);
        }
        return $expiration;
    }

    function verifyTransaction(Request $request){
        $query = [];
        if($request->query()){
            $query = $request->query();
        }else{
            $query = $request;
        }
        if($request->has('transaction_id') == false || $query['transaction_id']==null){
            return redirect('/done');
        }

        $id = $query['transaction_id'];
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '.env("API_SERVER_KEY").'',
        ])->get("https://api.flutterwave.com/v3/transactions/".$id."/verify");

        $data =  $response->json();

        $transaction = Transactions::where('transaction_ref','=',$query['tx_ref'])->where('status','=','pending')->leftJoin('services', 'transactions.service_id', '=', 'services.id')->get()->first();

        if($data['data']['status'] == 'successful'){
             if($transaction){
                $subscription = Subscriptions::where('user_id','=',$transaction->user_id)->where('service_id','=',$transaction->service_id)->get()->first();

                $user = User::where('id','=',$transaction->user_id)->get()->first();
                $plan = 'Basic Plan';
                if($subscription){
                    $expiration = Carbon::createFromFormat('Y-m-d',$subscription->expiry);
                    $expirationFunc = $this->getExpiration($transaction, $user,$expiration);
                    $subscription->update([
                        'expiry'=>$expirationFunc,
                        'reminded'=>null
                    ]);
                    $request['message'] ='Your premium subscription has been renewed and will expire on '.date('d M, Y',strtotime($expirationFunc));
                }else{

                    $expiration = Carbon::now();
                    $expirationFunc = $this->getExpiration($transaction, $user,$expiration);
                    $request['message'] = $transaction->service_id == 1 && $user->user_type == 'player'?  "basic" : "premium";
                    $plan = $transaction->service_id == 1 && $user->user_type == 'player'?  "Basic Plan" : "Premium Plan";
                    $request['message'] = "Your ".$request['message']." subscription has been activated and will expre on ".date('d M, Y',strtotime($expirationFunc));
                    $subscription = Subscriptions::create([
                        'user_id'=>$transaction->user_id,
                        'service_id'=>$transaction->service_id,
                        'expiry'=>$expirationFunc
                    ]);
                }
                $transaction = Transactions::where('transaction_ref','=',$query['tx_ref'])->get()->first();
                $transaction->update(['status'=>'complete']);


                $notifcationsController = new NotificationsController();


                //structure notification



                $request['route'] = '/subscription';
                $request['status'] = 'new';
                $request['user_id'] = $transaction->user_id;

                $name = $user->first_name[0].'.'.$user->last_name;
                $message = "$user->id:$user->user_type:$name subscribed to a $plan";

                if($user->agent != null){

                    $agent = User::find($user->agent);
                    $request['user_id'] = $agent->id;
                    $request['route'] = "";

                    $name = $agent->first_name[0].'.'.$agent->last_name;
                    $name2 = $user->first_name[0].'.'.$user->last_name;
                    $request['message']  = "Your subscription for $name has been activated, you can now make his/her account visible";
                    $message = "$agent->id:$agent->user_type:$name subscribed a premium service for $user->id:player:$name2";
                }

                $request->only(['message', 'route', 'status','user_id']);
                $notifcationsController->store($request);



                if($user->user_type != 'admin'){
                    $this->insertActivityLog($user,$request,$message);
                }
                return redirect('/done');

             }else{
                return redirect('/done');
             }
        }else{
            $transaction = Transactions::where('transaction_ref','=',$query['tx_ref'])->get()->first();
            $transaction->update(['status'=>'failed']);
            return redirect('/done');
        }
    }

    public function insertActivityLog($user,$request,$message){
        $activityLog  = new ActivityLogsController();
        $request['activity'] = $message;
        $request['user_id'] = $user->id;
        $request->only(['activity','user_id']);
        $activityLog->store($request);
    }

    public function getIp(){
    foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key){
        if (array_key_exists($key, $_SERVER) === true){
            foreach (explode(',', $_SERVER[$key]) as $ip){
                $ip = trim($ip); // just to be safe
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false){
                    return $ip;
                }
            }
        }
    }
    return request()->ip(); // it will return server ip when no client ip found
}
}
