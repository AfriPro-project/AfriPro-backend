import { useState } from "@hookstate/core";
import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sessionManager } from "../../authentication_module/states/authentication_state";
import { eventsState, fetchEvents, filterEvents, sortEvents,deleteEvent } from "../states/events_state";

function Events(){

    const navigate = useNavigate();
    const location = useLocation();
    const {search, events,currentPage, rowsPerPage} = useState(eventsState);

    useEffect(()=>{
        let redirect = sessionManager(location.pathname);
        if(redirect) navigate('/');

        fetchEvents();
    },[navigate,location])

    function getRows(data:any[]){
        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {
            row['title'] = <Link to={`/events/${row.id}`} style={{color:"white"}}>{row.title}</Link>
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
                title="Manage Events"
                showBackIcon={false}
                trailingButton={true}
                trailingText="Add New"
                onPressed={()=>navigate('/events/add')}
                />
                <SizedBox
                height={40}
                />



            <CustomTable
                label={"Search Events"}
                rows={getRows(events.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterEvents(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={true}
                menus={['Delete']}
                onMenuClicked={(menu:string,index:any)=>{
                    let event = events.get()[index];
                    deleteEvent(event['id']);
                }}
                onSortBy={(key:string)=>{
                    sortEvents(key);
                }}
                headings={[
                    {
                        "label":"Title",
                        "sortKey":"title"
                    },
                    {
                        "label":"Start Date & Time",
                        "sortKey":"date_time"
                    },
                    {
                        "label":"Reserved Seats",
                        "sortKey":"reserved seats"
                    }
                ]}
                />
            </>
            }
        />
    );
}


export default Events;
