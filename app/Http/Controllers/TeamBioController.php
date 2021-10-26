<?php

namespace App\Http\Controllers;

use App\Models\TeamBio;
use Illuminate\Http\Request;

class TeamBioController extends Controller
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
        $teamBio = TeamBio::create($request->all());
        return response($teamBio);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $teamBio = TeamBio::where('club_official_id',$request->user_id)
        ->leftJoin('users','team_bios.club_official_id','users.id')
        ->first();
        return response($teamBio, 200);
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
        $teamBio = TeamBio::where('club_official_id',$request['club_official_id'])->first();
        $teamBio->update($request->all());
        return response($teamBio, 200);
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
