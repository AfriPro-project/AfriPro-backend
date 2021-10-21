<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Opportunities;

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
        return $opportunity;
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
