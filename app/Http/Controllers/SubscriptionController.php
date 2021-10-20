<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subscriptions;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    function show(Request $request){
        $today = Carbon::now();
        $subscription = Subscriptions::where('user_id','=',$request->user_id)->where('expiry','>=',$today)->get();
        return $subscription;
    }
}
