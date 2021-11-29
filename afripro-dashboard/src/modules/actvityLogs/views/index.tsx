import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CustomDialog from "../../../components/dialog/dialog";
import Layout from "../../../components/layout/layout";
import Title from "../../../components/page_title";
import Preloader from "../../../components/preloader/preloader";
import SizedBox from "../../../components/sizedBox";
import CustomTable from "../../../components/table";
import { sortLogs, filterLogs, fetchLogs, activityLogsState } from "../states/activity_logs_states";
import {useState} from '@hookstate/core';
import Box from "@mui/system/Box";
import Avatar from "@mui/material/Avatar";

function ActvityLogs(){
    const navigate = useNavigate();
    const location = useLocation();
    const {search, logs,currentPage, rowsPerPage,} = useState(activityLogsState);

    useEffect(()=>{
        fetchLogs();
    },[navigate,location])


    const URL_REGEX = /[0-9]:(\w+):(\w+).(\w+)/;

    const renderText = (txt:string) =>
      txt.split(" ").map(part=>{
         if(URL_REGEX.test(part)){
             let parts = part.split(':');
             return <Link style={{color:"white",marginRight:5,marginLeft:5}} to={`/users/${parts[0]}/${parts[1]}`}>{parts[2] }</Link>;
         }else{
             return " "+part;
         }
      });

    function getRows(data:any[]){
        data = JSON.parse(JSON.stringify(data))
        data.forEach(row => {

            row['activity'] = <Box sx={{display:"flex",alignItems:"center"}}><Avatar sx={{ bgcolor: stringToColour(row['first_name']), color:"white" }}>{row['first_name'][0].toUpperCase()}</Avatar><SizedBox width={10}/>
            {renderText(row['activity'])}</Box>;
            delete row.id;
            delete row.first_name;
        });
        return data;
    }

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

    return (
            <Layout
            children={
                <>
                <Preloader/>
                <CustomDialog/>

                <Title
                title="Activity Logs"
                showBackIcon={false}
                trailingButton={false}
                />

                <SizedBox
                height={40}
                />

            <CustomTable
                label={"Search Logs"}
                rows={getRows(logs.get())}
                onPageChanged={(page:number)=>{
                    currentPage.set(page);
                }}
                onRowsPerPageChange={(page:number)=>{
                    rowsPerPage.set(page);
                }}
                onSearch={(value:string)=>{
                    filterLogs(value);
                }}
                search={search.get()}
                currentPage={currentPage.get()}
                rowsPerPage={rowsPerPage.get()}
                showActionButton={false}

                onSortBy={(key:string)=>{
                    sortLogs(key);
                }}
                headings={[
                    {
                        "label":"Activity",
                        "sortKey":"activity"
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


export default ActvityLogs;
