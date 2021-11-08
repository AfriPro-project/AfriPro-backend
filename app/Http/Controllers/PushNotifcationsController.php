<?php

namespace App\Http\Controllers;

use App\Models\ChatRoomUsers;
use Illuminate\Http\Request;

use App\Models\User;
class PushNotifcationsController extends Controller
{


    //send push to single user
    function sendPushToken($id, $data, $type){

        if($type == 'group'){
            $type = 'group';
            //get all users subscribe to topic tokens

            $registrationIds = ChatRoomUsers::where('chat_room_users.muted','false')
            ->where('chat_room_users.user_id','!=',auth()->user()->id)
            ->whereNotNull('users.fcmToken')
            ->where('chat_room_users.room_id',$id)
            ->leftJoin('users','chat_room_users.user_id','users.id')
            ->select('users.fcmToken')->pluck('users.fcmToken')->all();

        }else{
            $user = User::find($id);
            $registrationIds = $user->fcmToken;
        }



        if($registrationIds == null) return;

        #prep the bundle
             $msg = array
                  (
                    'body' 	=> $data['body'],
                    'title'	=> $data['title'],
                    "image"=> $data['image'],
                    "priority" => "high",
                    "sound"=>"iphone_notification1.mp3"
                  );

            $fields = array(
                        'notification'	=> $msg,
                        'data'=>$data
            );
            if($type == 'oneonone'){
                $fields['to'] = $registrationIds;
            }else{
                $fields['registration_ids'] = $registrationIds;
            }


            $headers = array
                    (
                        'Authorization: key='.env('FCM_SERVER_KEY'),
                        'Content-Type: application/json'
                    );

        #Send Reponse To FireBase Server
                $ch = curl_init();
                curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
                curl_setopt( $ch,CURLOPT_POST, true );
                curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
                curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
                curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
                curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
                $result = curl_exec($ch );
                curl_close( $ch );

                // echo $result;
        #Echo Result Of FireBase Server
        // echo $result;
    }
}
