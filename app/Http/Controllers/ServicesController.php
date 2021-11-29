<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Services;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $service = Services::create($request->all());
        return $service;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $service = Services::where('id','=',$id)->get()->first();
        return $service;
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

        $service = Services::find($request->service_id);
        $service->update($request->all());
        return $service;
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

    public function getServicesForAdmin(){
       $basicService = Services::where('service_name','Basic')->get()->first();
       $premiumService = Services::where('service_name','Premium')->get()->first();
       $data = array(
           "amount_for_player"=>array(
               "basic"=>$basicService->amount_for_player,
               "premium"=>$premiumService->amount_for_player
           ),
           "amount_for_agent"=>array(
               "premium"=>$basicService->amount_for_agent,
               "player_onboard"=>$premiumService->amount_for_agent
           )
       );

       return $data;
}
    }


