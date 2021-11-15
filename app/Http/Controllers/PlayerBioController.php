<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayerBio;
use App\Models\Subscriptions;
use App\Models\ProfileViews;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NotificationsController;
use App\Models\TeamBio;

class PlayerBioController extends Controller
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
    public function store(Request $request)
    {
        //create user bio
        if($request->pictures == null){
            $request['pictures'] = "public/files/default_avatar.jpg";
        }
        $playerBio = PlayerBio::create($request->all());
        return response($playerBio);
    }

    public function showBioOnly(Request $request){
        $playerBio = PlayerBio::where('player_id','=',$request->player_id)->get()->first();
        return $playerBio;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $playerBio = PlayerBio::select('users.*','player_bios.*',"subscriptions.*", DB::raw('count(profile_views.player_id) As views'))
        ->leftJoin('users','player_bios.player_id','users.id')
        ->leftJoin('subscriptions','player_bios.player_id','subscriptions.user_id')
        ->leftJoin('profile_views','player_bios.player_id','profile_views.player_id')
        ->where('player_bios.player_id',$request->player_id)
        ->get()->first();

        if($playerBio->service_id == 2){
            $playerBio['status'] = 'verified';
        }else{
            $playerBio['status'] = 'pending';
        }

        $playerBio['agentDetails'] = User::find($playerBio->agent);


        $user = auth()->user();
        if($playerBio->player_id != $request->user_id && $user->id != $playerBio->agent){
            //check if use has already viewed profile
            $profileView = ProfileViews::where('user_id','=',$request->user_id)->where('player_id','=',$request->player_id)->get()->first();
            if($profileView == null){
                ProfileViews::create([
                    'player_id'=>$request->player_id,
                    'user_id'=>$request->user_id
                ]);

                $notifcationsController = new NotificationsController();


                //structure notification
                $user = auth()->user();
                if($user->user_type == 'player'){
                    return;
                }

                $request['message'] = $user->user_type == 'agent' ? "An agent" : "A club official";
                if($user->user_type == 'club_official'){
                    $team = TeamBio::where('club_official_id',$user->id)->first();
                    $request['message'] .=' from '.$team->name_of_team;
                }
                $request['message'] .=' viewed your profile';
                $request['route'] = '/profile';
                $request['status'] = 'new';
                $request['user_id'] = $playerBio->player_id;
                unset($request['player_id']);
                $notifcationsController->store($request);
            }
        }
        if($playerBio->views >= 1000 && $playerBio->views < 1000000){
            $playerBio->views = $playerBio->views / 1000;
            $playerBio->views .= 'K';
        }else if($playerBio->views >= 1000000){
            $playerBio->views = $playerBio->views / 1000000;
            $playerBio->views .= 'M';
        }
        return $playerBio;
        //return response($playerBio, 200);
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
        //check if filters have select in them
         function filterValues($value){
            if(strpos($value,'All') > -1){
                return "";
            }else{
                return $value;
            }
         }

         if($request->height == ""){
             $request->height = 0;
         }
         $operator = $request->height > 0 ? '=' : '>';

         if($request->type == "verified"){
            $players = Subscriptions::where('subscriptions.service_id','=',2)
            ->where('player_bios.primary_position','!=',null)
            ->where('player_bios.date_of_birth','!=',null)
            ->where('users.blocked','=','false')
            ->where('subscriptions.expiry','>',date('Y-m-d'))
            ->join('player_bios','subscriptions.user_id','=','player_bios.player_id')
            ->join('users','users.id','=','subscriptions.user_id')
            ->select("users.first_name","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","player_bios.date_of_birth")
            ->orderBy('subscriptions.id', 'desc')
            ->paginate(5);
            foreach ($players as $player) {
                $player['status'] = 'verified';
            }
         }else if($request->type=="agent"){
            $user = auth()->user();
            $players = User::where('users.agent','=',$user->id)
            ->leftJoin('player_bios','users.id','=','player_bios.player_id')
            ->leftJoin('subscriptions','player_bios.player_id','subscriptions.user_id')
            ->select("users.first_name","subscriptions.service_id","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","player_bios.date_of_birth","users.blocked")
            ->orderBy('users.created_at','desc')
            ->paginate(12);
            foreach ($players as $player) {
                if($player->service_id == 2){
                    $player['status'] = 'verified';
                }else{
                    $player['status'] = 'pending';
                }
            }
         }else{

            $players = Subscriptions::where('subscriptions.service_id','!=',0)
            ->where('player_bios.primary_position','!=',null)
            ->where('player_bios.current_country','like',"%".filterValues($request->current_country)."%")
            ->where('player_bios.city','like',"%".filterValues($request->city)."%")
            ->where('player_bios.primary_position','like',"%".filterValues($request->primary_position)."%")
            ->where('player_bios.secondary_position','like',"%".filterValues($request->secondary_position)."%")
            ->where('player_bios.citizenship','like',"%".filterValues($request->citizenship)."%")
            ->where('player_bios.height_cm',$operator,filterValues($request->height))
            ->where('player_bios.date_of_birth','!=',null)
            ->where("subscriptions.expiry",'>',date('Y-m-d'))
            ->where('users.blocked','=','false')
            ->join('player_bios','subscriptions.user_id','=','player_bios.player_id')
            ->join('users','users.id','=','subscriptions.user_id')
            ->select("users.first_name","subscriptions.service_id","subscriptions.expiry","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","player_bios.date_of_birth")
            ->orderBy('subscriptions.id', 'desc')
            ->groupBy('subscriptions.user_id');

            if($request->isYoutubeLink == 'Yes'){
              $players = $players->where('player_bios.youtube_link','!=',null);
            }

            if($request->isTransferMarketlink == 'Yes'){
                $players = $players->where('player_bios.transfermarket_link','!=',null);
            }

            $players = $players->paginate(12);

            foreach ($players as $player) {
                //get player verified status
                $premiumSub = Subscriptions::Where('service_id',2)
                ->where('user_id',$player->player_id)->first();
                if($premiumSub){
                    $player['status'] = 'verified';
                }else{
                    $player['status'] = 'pending';
                }
            }
        }
        return $players;

    }

    function toggleBlocked(Request $request){
         $user = User::find($request->user_id);
          $subscription = Subscriptions::where('user_id','=',$user->id)->get()->first();
          if($subscription || $user->agent == null){
            $blocked = $user->blocked == 'true' ? 'false' : 'true';
            $user->update(['blocked'=>$blocked]);
          }else{
            return ["status"=>"error"];
          }

         return ['data'=>$user];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $playerBio = PlayerBio::where('player_id',$request->player_id)->get()->first();
        $playerBio->update($request->all());
        return response($playerBio, 200);
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
