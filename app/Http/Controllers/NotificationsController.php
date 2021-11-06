<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notifications;

class NotificationsController extends Controller
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
        $notification = Notifications::create($request->all());
        return $notification;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        //show current user notifications
        $id = auth()->user()->id;
        $notifications = Notifications::where('user_id',$id)
        ->orderBy('id','desc')->paginate(10);
        foreach ($notifications as $notification) {
            $notification['duration'] = $this->getDuration($notification['created_at']);
        }
        return $notifications;
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
        // return $request;
        $notification = Notifications::find($request->id);
        $notification->update(['status'=>'seen']);
        return $notification;
    }


    public function getDuration($date){
        $seconds_ago = (time() - strtotime($date));

        if ($seconds_ago >= 31536000) {
            return  intval($seconds_ago / 31536000) . "y";
        } elseif ($seconds_ago >= 2419200) {
            return  intval($seconds_ago / 2419200) . "m";
        } elseif ($seconds_ago >= 86400) {
            return  intval($seconds_ago / 86400) . "d";
        } elseif ($seconds_ago >= 3600) {
            return  intval($seconds_ago / 3600) . "h";
        } elseif ($seconds_ago >= 60) {
            return  intval($seconds_ago / 60) . "M";
        } else {
            return "1M";
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $notification = Notifications::find($request->id);
        $notification->delete();
        return ['status'=>'success','message'=>'notification deleted'];
    }
}
