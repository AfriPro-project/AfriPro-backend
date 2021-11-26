import { createState } from "@hookstate/core";
import { get } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";


export const messagesState = createState({
    messages:[],
    staticMessages:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    chatRoomMessages:[],
    staticChatRoomMessages:[],
    userOne:0,
 })

 export const filterMessages=(value:string)=>{
    const {messages,staticMessages, search,currentPage} = messagesState;
    let data = filter(value,"chat",staticMessages.get());
    messages.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortMessages=(key:any)=>{
   const {sortedKey, messages} = messagesState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,messages.get(),asend);
   messages.set(data);
}

export const fetchmessages=async()=>{
    let response = await get('/messages/admin/oneonone');
    if(messagesState.search.get().length < 1) messagesState.messages.set(response);
    messagesState.staticMessages.set(response);
}


export const fetchChatRoomMessages=async(id:string)=>{
    messagesState.chatRoomMessages.set([]);
    messagesState.staticChatRoomMessages.set([]);
    messagesState.userOne.set(0);
    let response = await get(`/chatrooms/messages/${id}`);
    let messages = response['messages'].reverse();
    messagesState.staticChatRoomMessages.set(messages);
    messagesState.chatRoomMessages.set(messages);

}
