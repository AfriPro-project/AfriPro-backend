<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Adverts;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdvertsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $advert = Adverts::find($request->id);
        return $advert;
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
       $adverts = Adverts::where('expiry_date','>=',$today)->where('status','active')->orderBy('rank','asc')->paginate(5);
       return $adverts;
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
        $advert = Adverts::find($request->id);
        $advert->update($request->all());
        return ["status"=>"success","message"=>"done"];
    }

    public function increaseClicks(Request $request)
    {
        $advert = Adverts::find($request->id);
        $advert->update(['clicks'=>($advert->clicks + 1)]);
        return ["status"=>"success","message"=>"done"];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
      $advert = Adverts::find($request->id);
      $advert->delete();
      return ["status"=>"success","message"=>"done"];
    }

    public function fetchAdsAdmin()
    {
       $ads = Adverts::select("sponsor_name","title",DB::raw('date_format(created_at, \'%d-%b-%Y\') as date_added'),"ad_url","clicks","rank","status","id")
       ->orderBy('id','desc')
       ->get();
       return $ads;
    }
}
