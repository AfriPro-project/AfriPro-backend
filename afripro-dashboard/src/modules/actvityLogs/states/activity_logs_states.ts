import { createState } from "@hookstate/core";
import { get,  } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";

export const activityLogsState=createState({
    logs:[],
    staticLogs:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:""
});

export const filterLogs=(value:string)=>{
    const {logs,staticLogs, search,currentPage} = activityLogsState;
    let data = filter(value,"activity",staticLogs.get());
    logs.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortLogs=(key:any)=>{
   const {sortedKey, logs} = activityLogsState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,logs.get(),asend);
   logs.set(data);
}

export const fetchLogs=async()=>{
    let response = await get('/activity_logs');
    if(activityLogsState.search.get().length < 1) activityLogsState.logs.set(response);
    activityLogsState.staticLogs.set(response);
}
