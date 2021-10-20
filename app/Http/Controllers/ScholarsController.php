<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Scholars;

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
}
