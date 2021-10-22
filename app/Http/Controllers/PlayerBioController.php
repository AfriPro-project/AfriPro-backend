<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PlayerBio;
use App\Models\Subscriptions;

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
        $playerBio = PlayerBio::create($request->all());
        return response($playerBio);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $playerBio = PlayerBio::where('player_id',$request->player_id)->get()->first();
        return response($playerBio, 200);
    }

     /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
         if($request->type == "verified"){
            $players = Subscriptions::where('subscriptions.service_id','=',2)->where("verification_docs.status",'=',"verified")->where('player_bios.primary_position','!=',null)->where('player_bios.date_of_birth','!=',null)->join('player_bios','subscriptions.user_id','=','player_bios.player_id')->join('users','users.id','=','subscriptions.user_id')->join("verification_docs","player_bios.player_id","verification_docs.user_id")->select("users.first_name","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","verification_docs.status","player_bios.date_of_birth")->orderBy('subscriptions.id', 'desc')->paginate(3);
         }else{
            $players = Subscriptions::where('subscriptions.service_id','!=',0)->where('player_bios.primary_position','!=',null)->where('player_bios.date_of_birth','!=',null)->join('player_bios','subscriptions.user_id','=','player_bios.player_id')->join('users','users.id','=','subscriptions.user_id')->leftJoin("verification_docs","player_bios.player_id","verification_docs.user_id")->select("users.first_name","users.last_name","player_bios.primary_position","player_bios.player_id","player_bios.pictures","verification_docs.status","player_bios.date_of_birth")->orderBy('subscriptions.id', 'desc')->paginate(3);
        }
        return $players;

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
