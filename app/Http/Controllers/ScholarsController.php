<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scholars;
use Illuminate\Support\Facades\DB;

class ScholarsController extends Controller
{
    function store(Request $request){
        $scholar = Scholars::where('player_id','=',$request->player_id)->get()->first();

        if($scholar){
            $scholar->update($request->all());

        }else{
            Scholars::create($request->all());
        }
        return $scholar;
    }

    public function getAll()
    {
        $scholars = Scholars::where('scholars.id','!=',0)
        ->leftJoin('users','scholars.player_id','users.id')
        ->select('scholars.id as scholar_id','users.id as id','users.user_type as role',DB::raw("CONCAT(users.first_name,' ',users.last_name) as name"),'scholars.academicLevel','scholars.isParentalConsent','scholars.isContactParents','scholars.whoCanGiveConsent','scholars.created_at as date_submitted')
        ->get();

        return $scholars;
    }

    public function delete(Request $request){
        $scholar = Scholars::find($request->id);
        $scholar->delete();
        return ["status"=>"success"];
    }
}
