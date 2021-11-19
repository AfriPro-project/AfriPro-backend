<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VerificationDocs;
use App\Http\Controllers\NotificationsController;

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
        $verificationDoc = VerificationDocs::where('user_id','=',$request->user_id);
        $verificationDoc = $verificationDoc->get()->first();
        return response($verificationDoc,200);
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
    public function destroy(Request $request)
    {
       $verificationDoc = VerificationDocs::find($request->id);
       $verificationDoc->delete();

       $notifcationsController = new NotificationsController();



        //structure notification
        $request['route'] = '/verification';
        $request['status'] = 'new';
        $request['user_id'] = $verificationDoc->user_id;
        $request['message'] = 'Your verification doccuments were rejected, please re-upload clearer and valid documents';
        $request->only(['message', 'route', 'status','user_id']);
        $notifcationsController->store($request);

       return ["status"=>"success"];
    }

    public function verifyDocs(Request $request){
        $verificationDoc = VerificationDocs::find($request->id);
       $verificationDoc->update(['status'=>'verified']);

       $notifcationsController = new NotificationsController();



        //structure notification
        $request['route'] = '';
        $request['status'] = 'new';
        $request['user_id'] = $verificationDoc->user_id;
        $request['message'] = 'Your verification doccuments are approved';
        $request->only(['message', 'route', 'status','user_id']);
        $notifcationsController->store($request);

       return ["status"=>"success"];
    }


    public function fetchVerificationDocs(){
        $verificationDocs = VerificationDocs::where('verification_docs.id','!=',0)
        ->leftJoin('users','users.id','verification_docs.user_id')
        ->select('users.first_name','users.last_name','verification_docs.created_at as date_submitted','verification_docs.status as status','verification_docs.id as id')
        ->orderBy('verification_docs.status','asc')->get();
        $results = array();
        foreach ($verificationDocs as $verificationDoc) {
            $data = array();
            $data['name'] = $verificationDoc->first_name.' '.$verificationDoc->last_name;
            $data['id'] = $verificationDoc->id;
            $data['status'] = $verificationDoc->status;
            $data['date_submitted'] = $verificationDoc->date_submitted;
            array_push($results,$data);
        }
        return $results;
    }

    public function getVerificationDoc(Request $request){
        $verificationDoc = VerificationDocs::where('verification_docs.id',$request->id)
        ->leftJoin('users','verification_docs.user_id','users.id')->get()->first();
        return $verificationDoc;
    }
}
