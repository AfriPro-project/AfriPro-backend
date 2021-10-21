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
                if($request->player_id){
                    $user = User::where('id','=',$request->player_id)->get()->first();
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
                    $transaction_id = 'tx_ref_'.$id.'|'.md5($id);
                    $currency = Http::get('https://ipapi.co/currency/');
                    $amountToPay = Currency::convert()
                    ->from('EUR')
                    ->to($currency)
                    ->amount($service_amount)
                    ->get();
                     $amount = sprintf('%0.2f',$amountToPay);
                    //create a transaction
                    Transactions::create([
                        "service_id"=>$service->id,
                        'transaction_ref'=>$transaction_id,
                        'status'=>'pending',
                        'user_id'=>$user->id
                    ]);
                    $data = [
                        "tx_ref" => $transaction_id,
                        "amount" => $amount,
                        "currency" => $currency->body(),
                        "redirect_url" => env('APP_VERIFY_TRANSACTION_URL'),
                        "payment_options" => "card,mobilemoney",
                        "meta" => [
                              "consumer_id" => $user->id,
                              "consumer_mac" => "92a3-912ba-1192a"
                           ],
                        "customer" => [
                                 "email" => $user->email,
                                 "phonenumber" => $user->phone_number,
                                 "name" => $user->first_name.' '.$user->last_name
                              ],
                        "customizations" => [
                                    "title" => "Subscription",
                                    "description" => $service->service_name,
                                    "logo" => "https://assets.piedpiper.com/logo.png"
                                 ]
                     ];

                    //  if($service->id == 2){
                    //      $data['payment_plan'] = env('PAYMENT_PLAN_ID');
                    //  }

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

    function getExpiration($transaction,$user,$expiration){
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

                if($subscription){
                    $expiration = Carbon::createFromFormat('Y-m-d',$subscription->expiry);
                    $expirationFunc = $this->getExpiration($transaction, $user,$expiration);
                    $subscription->update([
                        'expiry'=>$expirationFunc
                    ]);
                }else{
                    $expiration = Carbon::now();
                    $expirationFunc = $this->getExpiration($transaction, $user,$expiration);
                    $subscription = Subscriptions::create([
                        'user_id'=>$transaction->user_id,
                        'service_id'=>$transaction->service_id,
                        'expiry'=>$expirationFunc
                    ]);
                }
                $transaction = Transactions::where('transaction_ref','=',$query['tx_ref'])->get()->first();
                $transaction->update(['status'=>'complete']);
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
}