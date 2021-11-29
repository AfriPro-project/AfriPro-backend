import { useState } from "@hookstate/core";
import Box from "@mui/system/Box";
import { useEffect , useState as reactUseState} from "react";
import { Link, useParams } from "react-router-dom";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import TextInput from "../../../components/textInput";
import { filter } from "../../../utils/globalFunctions/sort_filter_function";
import { fetchChatRoomMessages, messagesState } from "../states/messages_state";

function MessageInfo(){

    const {chatRoomMessages,userOne,staticChatRoomMessages} = useState(messagesState);
    const [search, setSearch] = reactUseState("");

    let {id} = useParams();
    let {chat} = useParams();
    useEffect(()=>{
        fetchChatRoomMessages(id!);
    },[id])


    const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

    const renderText = (txt:string) =>
      txt.split(" ").map(part =>
          URL_REGEX.test(part) ? <a  href={part} target="_blank" style={{color:"white"}} rel="noreferrer" >{part} </a> : part + " "
    );

    let stringToColour = function(str:string) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var x = 0; x < 3; x++) {
          var value = (hash >> (x * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }

    const filterMessages=(value:string)=>{
        let data = filter(value,"message",staticChatRoomMessages.get());
        chatRoomMessages.set(data);
        setSearch(value);
    }

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Box
                sx={{
                    display:"flex",
                    flexDirection:"column",
                    height:"100vh"
                }}
                >
                <Box
                >
                    <Title
                    title="Back to All Messages"
                    showBackIcon={true}
                    trailingText={chat}
                    trailingButton={false}
                    />
                    <SizedBox
                    height={40}
                    />

                    <TextInput
                        label={"Seach Messages"}
                        value={search}
                        isPassword={false}
                        onChanged={(value:string)=>{
                            filterMessages(value);
                        }}
                    />

                    <SizedBox
                    height={10}
                    />
                </Box>

                <Box
                sx={{
                    flex:"1",
                    overflowY:"auto",
                }}>
                    {chatRoomMessages.get().map((message:any,index)=>{

                        if(userOne.get() === 0){
                            userOne.set(message['sender_id']);
                        }

                        if(message['type']==="bot message"){
                            return <Box
                            key={index}
                            sx={{
                                display:"flex",
                                alignItems:"cetner",
                            }}
                            ><Box sx={{
                                backgroundColor:"#000",
                                borderRadius:3,
                                margin:"auto",
                                padding:1,
                                fontSize:12,
                                display:"inline-block",
                                marginBottom:1
                            }}><Link
                                style={{color:"white"}}
                                to={`/users/${message['sender_id']}/${message['user_type']}`}>{message['first_name']}</Link> {message['message']}</Box></Box>
                        }

                        return <Box key={index} sx={{display:"flex",flexDirection:message['sender_id'] === userOne.get() ? "row" : "row-reverse"}}>
                            <Box
                            sx={{
                                maxWidth:300,
                                wordWrap:"break-word",
                                padding:2,
                                backgroundColor:message['sender_id'] === userOne.get() ? "#575757" : "#049256",
                                borderRadius:5,
                                marginTop:1
                            }}
                            >
                                <Link
                                style={{color:stringToColour(message['first_name'])}}
                                to={`/users/${message['sender_id']}/${message['user_type']}`}>{message['first_name'][0]+'.'+message['last_name']}</Link><br/><br/>
                                {message['image']  != null ? <img style={{width:"100%",borderRadius:10}} src={process.env.REACT_APP_BACKEND_APP_URL+''+message['image'].replace('public','storage')} alt="text"/> : null}
                                {message['message'] != null ? renderText(message['message']) : ""}
                            </Box>
                        </Box>
                    })}
                </Box>
                </Box>
            </>
            }
        />
    );
}


export default MessageInfo;
