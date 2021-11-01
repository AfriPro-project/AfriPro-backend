<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayerBio;
use App\Models\Subscriptions;
use App\Models\ProfileViews;
use App\Models\User;
use Illuminate\Support\Facades\DB;
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


        $user = auth()->user();
        if($playerBio->player_id != $request->user_id && $user->id != $playerBio->agent){
            //check if use has already viewed profile
            $profileView = ProfileViews::where('user_id','=',$request->user_id)->where('player_id','=',$request->player_id)->get()->first();
            if($profileView == null){
                ProfileViews::create([
                    'player_id'=>$request->player_id,
                    'user_id'=>$request->user_id
                ]);
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
            ->join('player_bios','subscriptions.user_id','=','player_bios.player_id')
            ->join('users','users.id','=','subscriptions.user_id')
            ->select("users.first_name","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","player_bios.date_of_birth")
            ->orderBy('subscriptions.id', 'desc')
            ->paginate(5);
            foreach ($players as $player) {
                $player['status'] = 'veririfed';
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
                    $player['status'] = 'veririfed';
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
            // ->where('player_bios.transfermarket_link',$isTransferMarketlink,null)
            // ->where('player_bios.youtube_link',$isYoutubeLink,null)
            ->where("subscriptions.expiry",'>',date('Y-m-d'))
            ->where('users.blocked','=','false')
            ->join('player_bios','subscriptions.user_id','=','player_bios.player_id')
            ->join('users','users.id','=','subscriptions.user_id')
            ->select("users.first_name","subscriptions.service_id","subscriptions.expiry","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","player_bios.date_of_birth")
            ->orderBy('subscriptions.id', 'desc');

            if($request->isYoutubeLink == 'Yes'){
              $players = $players->where('player_bios.youtube_link','!=',null);
            }

            if($request->isTransferMarketlink == 'Yes'){
                $players = $players->where('player_bios.transfermarket_link','!=',null);
            }

            $players = $players->paginate(12);

            foreach ($players as $player) {
                if($player->service_id == 2){
                    $player['status'] = 'veririfed';
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
          if($subscription){
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
