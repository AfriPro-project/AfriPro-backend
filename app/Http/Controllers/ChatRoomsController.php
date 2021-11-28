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
        $request['room_id'] = base64_encode($chatRoom->id.'_22352341234534');
        $this->joinChatRoom($request);

        //structrue message
        $request['room_id'] = $chatRoom->id;
        $request['message'] = ' created this topic';
        $request['type'] = 'bot message';
        unset($request['room_name']);
        unset($request['owner']);
        unset($request['room_type']);
        $this->sendMessage($request);
        return $chatRoom;
    }

    //update chat room name
    function updateChatRoomName(Request $request){
        $room = ChatRooms::find($request->room_id);
        $room->update(['room_name'=>$request->new_name]);
        //structrue message
        $request['message'] = 'changed this topic to '.$request->new_name;
        $request['type'] = 'bot message';
        unset($request['old_name']);
        return $this->sendMessage($request);
    }

    //join a chat room
    function joinChatRoom(Request $request){
        if($request->room_id == null){
            return response(['status'=>'error','message'=>'room id is required']);
        }
        $user = auth()->user();
        //check if the room exist
        $request['room_id'] = base64_decode($request->room_id);
        $request['room_id'] = explode('_',$request['room_id']);
        $request['room_id'] = $request['room_id'][0];

        $room = ChatRooms::find($request->room_id);
        if($room == null){
            return response(['status'=>'error','message'=>'room not found']);
        }
        //check if user is already in chat room
        $checkUser = ChatRoomUsers::where('user_id','=',$user->id)
        ->where('room_id','=',$room->id)
        ->get()->first();
        if($checkUser){
            return response(['status'=>'failed','room'=>$room,'message'=>'you are already in this chat room']);
        }

        $roomJoined = ChatRoomUsers::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'muted' => 'false'
        ]);

        if($room->room_type == 'group'){
            //structrue message
            $request['message'] = ' joined this topic';
            $request['type'] = 'bot message';
            unset($request['user_id']);
            return $this->sendMessage($request);
        }

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
        $user = auth()->user();
        if($room == null){

            //create a one on one chat room for agent and player
            //here room name will be the email of the player
            $chatRoomName = $request->room_name.'|'.$user->email;

            $room = ChatRooms::where('room_name',$chatRoomName)->first();

            if($room == null){

            $room = ChatRooms::create([
                'owner'=>$user->id,
                'room_name'=>$chatRoomName,
                'room_type'=>'oneonone'
            ]);

            $player = User::where('email',$request->room_name)->first();

            if($player == null){
                return response(['status'=>'error','message'=>'room not found']);
            }

            //add agent and player to room

            ChatRoomUsers::create([
                'room_id'=>$room->id,
                'user_id'=>$player->id,
                'muted'=>'false'
            ]);

            ChatRoomUsers::create([
                'room_id'=>$room->id,
                'user_id'=>$user->id,
                'muted'=>'false'
            ]);

            $request['room_id'] = $room->id;
            }else{
                $request['room_id'] = $room->id;
            }

            //return $chatRoom;

        }

        unset($request['room_name']);
        $message = ChatRoomMessages::create($request->all());
        $message['first_name'] = $user->first_name;
        $message['last_name'] = $user->last_name;
        $message['sent'] = 'Today';
        $message['seen'] = 'true';
        $message['status'] = 'receiving';
        $message['time'] = date('h:i A',strtotime($message['created_at']));


        //send push
        $pushNotificationController = new PushNotifcationsController();
        $title = $room->room_type == "oneonone" ? $user->first_name : '#'.$room->room_name.'-'.$user->first_name;

        if($room->room_type == "oneonone"){
            $chatRoomName  = $room->room_name;
            $room['room_name'] = $user['first_name'][0].'.'.$user["last_name"];
        }

        $responseData = [
            'status'=>'sucess',
            'room'=>$room,
            'message'=>$message
        ];

        $data = array(
            "title"=>$title,
            "body"=>$message->message,
            'image'=>"",
            "type"=>"chat",
            "data"=>$responseData
        );

        $pushNotificationController->sendPushToken($message->room_id, $data,'group');
        return response($responseData);
    }

    //get user latest messages
    function getLatestMessages(){
        $user = auth()->user();

        $chatRooms = ChatRoomUsers::where('user_id','=',$user->id)
        ->leftJoin('chat_rooms','chat_room_users.room_id','chat_rooms.id')
        ->get();
        $messages = [];
        foreach ($chatRooms as $chatRoom) {
            $latestMessage = ChatRoomMessages::where('chat_room_messages.room_id','=',$chatRoom->room_id)
            ->leftJoin('users','chat_room_messages.sender_id','users.id')
            ->orderBy('chat_room_messages.id','desc')
            ->select('users.*','chat_room_messages.*','chat_room_messages.id as m_id')
            ->first();
            $chatRoomName  = $chatRoom->room_name;
            if(strpos($chatRoomName,$user->email) > -1){
                $chatRoomName = str_replace($user->email, "",$chatRoomName);
                $chatRoomName = str_replace("|", "",$chatRoomName);
                $recipient = User::where('email','=',$chatRoomName)->get()->first();

                if($recipient){
                    $chatRoomName = $recipient['first_name'][0].'.'.$recipient["last_name"];
                }else{
                    $chatRoomName = $chatRoomName;
                }

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

            $link = base64_encode($chatRoom->room_id.'_22352341234534');
            $message = [
                'room_link'=>$link,
                'room_name'=>$chatRoomName,
                'room_id'=>$chatRoom->room_id,
                'room_type'=>$chatRoom->room_type,
                'owner'=>$chatRoom->owner,
                'muted'=>$chatRoom->muted,
                'message'=>$latestMessage
            ];
            array_push($messages,$message);
        }

        usort($messages, function($a, $b) { return $b['message']['m_id'] <=> $a['message']['m_id']; });

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

        //check if chat room exists
        $chatRoom = ChatRooms::where('id',$request->room_id)
        ->orWhere('room_name',$request->room_id)->first();
        if($chatRoom==null){
            return ['status'=>'failed','messages'=>'room not found'];
        }

        $request['room_id'] = $chatRoom->id;

        //update all messages to read
        $user = auth()->user();
        if($user->user_type != 'admin'){
            $messages = DB::update('UPDATE chat_room_messages SET `read`=CONCAT(`read`,",'.$user->email.'") WHERE  `room_id` = "'.$request->room_id.'" and `read` not like "%'.$user->email.'%"');
        }


        //get all mesages
        $messages = ChatRoomMessages::where('room_id','=',$request->room_id)
        ->leftJoin('users','chat_room_messages.sender_id','users.id')
        ->select('chat_room_messages.message','chat_room_messages.sender_id','chat_room_messages.type','chat_room_messages.image','chat_room_messages.created_at','chat_room_messages.id',"users.first_name",'users.user_type',"users.last_name","chat_room_messages.read")
        ->orderBy('chat_room_messages.created_at','desc');


        //get room
        $room = ChatRooms::where('chat_rooms.id','=',$request->room_id)
        ->leftJoin('chat_room_users','chat_rooms.id','chat_room_users.room_id');
        if($user->user_type != 'admin'){
            $room = $room->where('chat_room_users.user_id',$user->id);
        }
        $room=$room->first();

        if($room == null){
            return ['status'=>'failed','messages'=>'user not in room'];
        }

        $link = md5($chatRoom->room_id);
        $link = url('/').'/chatrooms/join/'.$link;
        $room['room_link']=$link;


        if($room->type == 'group'){
          $messages=$messages->leftJoin('player_bios','chat_rooms.user_id','player_bios.player_id');
          $messages=$messages->select('player_bios.pictures');
        }

        if($user->user_type != 'admin'){
            $messages = $messages->paginate(20);
        }else{
            $messages = $messages->get();
        }


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

         //structrue message
         $request['message'] = 'left this topic';
         $request['type'] = 'bot message';
         unset($request['user_id']);
         return $this->sendMessage($request);
    }

    function deleteMessage(Request $request){
      $message = ChatRoomMessages::find($request->id);
      if($message){
          $message->delete();
          return ['status'=>'success','message'=>'messaged deleted'];
      }
      return ['status'=>'failed'];
    }

    function getRoomMembers(Request $request){
        $members = ChatRoomUsers::where('chat_room_users.room_id','=',$request->room_id)
        ->leftJoin('chat_rooms','chat_rooms.id','chat_room_users.room_id')
        ->leftJoin('users','chat_room_users.user_id','users.id')
        ->leftJoin('player_bios','chat_room_users.user_id','player_bios.player_id')
        ->get();
        return $members;
    }

    function allMessages(Request $request){
        $messages = ChatRooms::where('chat_rooms.room_type',$request->room_type)
        ->select('chat_rooms.room_name as chat',DB::raw('date_format(chat_room_messages.updated_at, \'%d-%b-%Y\') as last_updated'),'chat_rooms.id')
        ->leftJoin('chat_room_messages','chat_rooms.id','chat_room_messages.room_id')
        ->orderBy('chat_room_messages.id','desc')
        ->groupBy('chat_rooms.id')->get();

        if($request->room_type != 'group'){
            foreach ($messages as $message) {
                $users = explode('|',$message['chat']);
                $user = User::where('email',$users[0])->get()->first();
                $user2 = User::where('email',$users[1])->get()->first();
                $message['chat'] = $user['first_name'][0].'.'.$user['last_name'].' & '.$user2['first_name'][0].'.'.$user2['last_name'];
            }
        }
        return $messages;
    }
}
