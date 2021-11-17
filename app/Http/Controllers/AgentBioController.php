<?php

namespace App\Http\Controllers;

use App\Models\AgentBio;
use Illuminate\Http\Request;

class AgentBioController extends Controller
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
        $agentBio = AgentBio::create($request->all());
        return response($agentBio);
    }


    public function showBioOnly(Request $request)
    {

        $agentBio = AgentBio::where('agent_id',$request->agent_id)->get()->first();
        return response($agentBio, 200);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $agentBio = AgentBio::where('agent_id',$request->user_id)
        ->leftJoin('users','agent_bios.agent_id','users.id')
        ->leftJoin('subscriptions','users.id','subscriptions.user_id')
        ->first();
        return response($agentBio, 200);
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
        $agentBio = AgentBio::where('agent_id',$request['agent_id'])->first();
        $agentBio->update($request->all());
        return response($agentBio, 200);
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
