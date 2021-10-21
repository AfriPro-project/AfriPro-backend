<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VerificationDocs;

class VerificationDocsController extends Controller
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
        $verificationDocs = VerificationDocs::create($request->all());
        return response($verificationDocs,200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $verificationDocs = VerificationDocs::where('user_id','=',$request->user_id)->get()->first();
        return response($verificationDocs,200);
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
        $verificationDocs = VerificationDocs::where('user_id','=',$request->user_id)->get()->first();
        $verificationDocs->update($request->all());
        return response($verificationDocs,200);
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
