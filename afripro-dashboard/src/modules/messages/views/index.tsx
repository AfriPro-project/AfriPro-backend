import { useState } from "@hookstate/core";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { fetchmessages, filterMessages, messagesState, sortMessages } from "../states/messages_state";

function Messages(){

    const navigate = useNavigate();
    const location = useLocation();
    const {messages,currentPage,rowsPerPage,search} = useState(messagesState);


    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchmessages();
    },[navigate,location])


    function getRows(data:any[]){

        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['chat'] = <Link to={`/messages/${row.id}/${row.chat}`} style={{color:"white"}}>{row.chat}</Link>
            delete row.id;
        });
        return data;
    }


    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Messages"
                showBackIcon={false}
                trailingButton={false}
                />
                <SizedBox
                height={40}
                />

            <CustomTable
                label={"Search Messages"}
                rows={getRows(messages.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterMessages(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['View']}
                onMenuClicked={(menu:string,index:any)=>{
                    let message = messages.get()[index];
                    navigate(`/messages/${message['id']}/${message['user_type']}`);
                }}
                onSortBy={(key:string)=>{
                    sortMessages(key);
                }}
                headings={[
                    {
                        "label":"Chat",
                        "sortKey":"chat"
                    },
                    {
                        "label":"Last Updated",
                        "sortKey":"last_updated"
                    }
                ]}
                />
            </>
            }
        />
    );
}


export default Messages;
