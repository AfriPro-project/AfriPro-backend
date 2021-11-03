<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChatRoomMessages;
use App\Models\ChatRooms;
use App\Models\ChatRoomUsers;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ChatRoomsController extends Controller
{
    //create a new chat room
    function createChatRoom(Request $request){
        $user = auth()->user();
        $request['owner'] = $user->id;
        $chatRoom = ChatRooms::create($request->all());
        $request['room_id'] = $chatRoom->id;
        $this->joinChatRoom($request);

        //structrue message
        $request['message'] = 'topic created';
        $request['type'] = 'bot message';
        unset($request['room_name']);
        unset($request['owner']);
        unset($request['room_type']);
        $this->sendMessage($request);
        return $chatRoom;
    }

    //join a chat room
    function joinChatRoom(Request $request){
        if($request->room_id == null){
            return response(['status'=>'error','message'=>'room id is required']);
        }
        $user = auth()->user()->id;
        //check if the room exist
        $room = ChatRooms::find($request->room_id);
        if($room == null){
            return response(['status'=>'error','message'=>'room not found']);
        }
        //check if user is already in chat room
        $checkUser = ChatRoomUsers::where('user_id','=',$user)
        ->where('room_id','=',$room->id)
        ->get()->first();
        if($checkUser){
            return response(['status'=>'error','message'=>'you are already in this chat room']);
        }

        $roomJoined = ChatRoomUsers::create([
            'user_id' => $user,
            'room_id' => $room->id,
            'muted' => 'false'
        ]);

        return response([
            'status'=>'sucess',
            'user_id'=>$roomJoined->user_id,
            'room'=>$room
        ]);
    }

    //send a message
    function sendMessage(Request $request){
        if($request->room_id == null){
            return response(['status'=>'error','message'=>'room id is required']);
        }
        $user = auth()->user();
        $request['sender_id'] = $user->id;
        $request['read'] = $user->email;
        //check if the room exist
        $room = ChatRooms::find($request->room_id);
        if($room == null){
            return response(['status'=>'error','message'=>'room not found']);
        }

        unset($request['room_name']);
        $message = ChatRoomMessages::create($request->all());
        $message['first_name'] = $user->first_name;
        $message['last_name'] = $user->last_name;
        $message['sent'] = 'Today';
        $message['seen'] = 'true';
        $message['status'] = 'receiving';
        $message['time'] = date('h:i A',strtotime($message['created_at']));

        return response([
            'status'=>'sucess',
            'message'=>$message
        ]);
    }

    //get user latest messages
    function getLatestMessages(){
        $user = auth()->user();

        $chatRooms = ChatRoomUsers::where('user_id','=',$user->id)
        ->leftJoin('chat_rooms','chat_room_users.room_id','chat_rooms.id')
        ->get();
        $messages = [];
        foreach ($chatRooms as $chatRoom) {
            $latestMessage = ChatRoomMessages::where('room_id','=',$chatRoom->room_id)
            ->orderBy('id','desc')
            ->first();
            $chatRoomName  = $chatRoom->room_name;
            if(strpos($chatRoomName,$user->email) > -1){
                $chatRoomName = str_replace($user->email, "",$chatRoomName);
                $chatRoomName = str_replace("|", "",$chatRoomName);
                $recipient = User::where('email','=',$chatRoomName)->first();
                $chatRoomName = $recipient->first_name;
            }

            if($latestMessage->sender_id == $user->id){
                $latestMessage['status'] = 'sending';
            }else{
                $latestMessage['status'] = 'receiving';
            }

            $sent = gmdate('Y-m-d',strtotime($latestMessage['created_at']));
            $latestMessage['sent'] = $this->getLastSent($sent);

            $unreadMessages = ChatRoomMessages::where('room_id','=',$chatRoom->room_id)
            ->where('read','not like',"%".$user->email."%")->get();

            $latestMessage['unread_messages'] =  sizeOf($unreadMessages);

            if(sizeof(explode(",",$latestMessage['read'])) > 1){
                $latestMessage['seen'] = 'true';
            }else{
                $latestMessage['seen'] = 'false';
            }

            $link = md5($chatRoom->room_id);
            $link = url('/').'/chatrooms/join/'.$link;
            $message = [
                'room_link'=>$link,
                'room_name'=>$chatRoomName,
                'room_id'=>$chatRoom->room_id,
                'room_type'=>$chatRoom->room_type,
                'muted'=>$chatRoom->muted,
                'message'=>$latestMessage
            ];
            array_push($messages,$message);
        }

        usort($messages, function($a, $b) { return $b['message']['id'] <=> $a['message']['id']; });

        return ['status'=>'sucess','messages'=>$messages];
    }

    function getLastSent($sent){
        if($sent == date('Y-m-d')){
            return 'Today';
        }

        $today = Carbon::now();;
        $sent = Carbon::createFromFormat('Y-m-d',$sent);
        $diff = $sent->diff($today)->days;

        if($diff == 1){
            return 'Yesterday';
        }

        if($diff > 1){
            return date('l',strtotime($sent));
        }

        if($diff > 7){
            return date('Y/m/d',strtotime($sent));
        }
    }

    //get room messages
    function getRoomMessages(Request $request){
        if($request->room_id == null){
            return response(['status'=>'error','message'=>'room id is required']);
        }

        //update all messages to read
        $user = auth()->user();
        $messages = DB::update('UPDATE chat_room_messages SET `read`=CONCAT(`read`,",'.$user->email.'") WHERE  `room_id` = "'.$request->room_id.'" and `read` not like "%'.$user->email.'%"');


        //get all mesages
        $messages = ChatRoomMessages::where('room_id','=',$request->room_id)
        ->leftJoin('users','chat_room_messages.sender_id','users.id')
        ->select('chat_room_messages.message','chat_room_messages.sender_id','chat_room_messages.type','chat_room_messages.image','chat_room_messages.created_at','chat_room_messages.id',"users.first_name","users.last_name","chat_room_messages.read")
        ->orderBy('chat_room_messages.created_at','desc');

        //get room
        $room = ChatRooms::find($request->room_id);

        if($room->type == 'group'){
          $messages=$messages->leftJoin('player_bios','chat_rooms.user_id','player_bios.player_id');
          $messages=$messages->select('player_bios.pictures');
        }
        $messages = $messages->get();

        foreach ($messages as $message) {
            $message['sent'] = $this->getLastSent(date('Y-m-d',strtotime($message['created_at'])));

            if(sizeof(explode(",",$message['read'])) > 1){
                $message['seen'] = 'true';
            }else{
                $message['seen'] = 'false';
            }

            if($message->sender_id == $user->id){
                $message['status'] = 'sending';
            }else{
                $message['status'] = 'receiving';
            }

            $message['time'] = date('h:i A',strtotime($message['created_at']));
        }
        return ['status'=>'sucess','room'=>$room,'messages'=>$messages];
    }

    function toggleMute(Request $request){
        $room = ChatRoomUsers::where('user_id','=',auth()->user()->id)
        ->where('room_id','=',$request->room_id)->first();
        if($room->muted == 'true'){
            $muted = 'false';
        }else{
            $muted = 'true';
        }
        $room->update(['muted'=>$muted]);
        return $room;
    }

    function leaveRoom(Request $request){
        $user = auth()->user();
        $room = ChatRoomUsers::where('user_id','=',$user->id)
        ->where('room_id','=',$request->room_id);
        $room->delete();
        return ['status'=>'success','message'=>"You've left this topic"];
    }
}
