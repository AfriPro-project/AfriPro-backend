<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Subscriptions;
use App\Models\ProfileViews;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function fetchDashboardStat(){
        $id = auth()->user()->id;

        $users = User::all()->except($id)->count();

        $premiumSubscriptons = Subscriptions::where('service_id',2)
        ->where('expiry','>=',date('Y-m-d'))->get()->count();

        $premiumSubscriptonsAgent = User::where('users.user_type','agent')
        ->join('subscriptions','users.id','subscriptions.user_id')
        ->where('subscriptions.service_id',1)
        ->where('expiry','>=',date('Y-m-d'))->get()->count();

        $profileViews = ProfileViews::all()->count();

       $paidUsers = array();
       $normalUsers = array();


       for ($i=0; $i < 12; $i++) {
            $data = Subscriptions::select(DB::raw('count(id) as `count`'))
            ->where('expiry','>=',date('Y-m-d'))
            ->whereYear('created_at',date('Y'))
            ->whereMonth('created_at',$i+1)
            ->get()->first();

            $normalUsersCount = User::whereYear('created_at',date('Y'))
            ->whereMonth('created_at',$i+1)
            ->get()->count();

            $normal = ($normalUsersCount - $data->count) < 0 ? 0 : $normalUsersCount - $data->count;
            array_push($normalUsers, $normal);

            array_push($paidUsers,$data->count);
       }
       $response = [
           'status'=>'success',
            'data'=>[
                'users'=>number_format($users),
                'premiumSubscriptions'=>number_format($premiumSubscriptons + $premiumSubscriptonsAgent),
                'profileViews'=>number_format($profileViews),
                "paidUsers"=>$paidUsers,
                "normalUsers"=>$normalUsers
            ]
       ];

       return $response;
    }
}
