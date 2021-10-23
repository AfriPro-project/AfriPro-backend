<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Opportunities;
use App\Models\OpportunitiesAppliedBy;

class OpportunitiesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
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
        $opportunity = Opportunities::create($request->all());
        return $opportunity;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $opportunity = Opportunities::find($request->id);

        //check if player has applied to this opportunity
        $applied = OpportunitiesAppliedBy::where('player_id','=',$request->user_id)->where('opportunity_id','=',$request->id)->get()->first();
        if($applied){
            $opportunity['applied'] = true;

        }else{
            $opportunity['applied'] = false;
        }
        return $opportunity;
    }

     /**
     * Display the specified resource.
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
         if($request->user_type == "club_official"){
            $opportunities = Opportunities::where('user_id','=',$request->user_id)->orderBy('id', 'desc')->paginate(5);
         }else{
            $opportunities = Opportunities::where('status','=','open')->orderBy('id', 'desc')->paginate(5);
        }
        return $opportunities;
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
        $opportunity = Opportunities::find($request->id);
        $opportunity->update($request->all());
        return response($opportunity,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $res = Opportunities::find($request->id)->delete();
        if ($res){
            $data=[
            'status'=>'1',
            'msg'=>'success'
          ];
        }else{
            $data=[
            'status'=>'0',
            'msg'=>'fail'
          ];
        }
        return $data;
    }
}
