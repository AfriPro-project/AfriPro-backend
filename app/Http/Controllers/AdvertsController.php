<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adverts;
use Carbon\Carbon;
class AdvertsController extends Controller
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
        $advert = Adverts::where('rank','=',$request->rank)->get()->first();
        if($advert){
            return ['status'=>'error','message'=>'advert with rank already exist'];
        }
        $advert = Adverts::create($request->all());
        return $advert;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function showAll(Request $request)
    {
        $today = Carbon::now();;
       $adverts = Adverts::where('expiry_date','>',$today)->orderBy('rank','desc')->paginate(5);
       return $adverts;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
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
