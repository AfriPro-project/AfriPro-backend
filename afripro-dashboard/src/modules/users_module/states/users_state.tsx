import { createState } from "@hookstate/core";
import {sort,filter} from '../../../utils/globalFunctions/sort_filter_function';


export const usersState = createState({
    users:[
        {
            name:"Frozen yoghurt",
            role:"Player",
            last_active:"2021-11-01",
            subscription:"Premium",

        },
        {
            name:"Rice",
            role:"Player",
            last_active:"2021-11-01",
            subscription:"Basic",

        },
        {
            name:"Yam",
            role:"Agent",
            last_active:"2021-11-01",
            subscription:"Basic",

        },
        {
            name:"Casava",
            role:"Club Official",
            last_active:"2021-11-01",
            subscription:"Premium",

        }
    ],
    staticUsers:[
        {
            name:"Frozen yoghurt",
            role:"Player",
            last_active:"2021-11-01",
            subscription:"Premium",

        },
        {
            name:"Rice",
            role:"Player",
            last_active:"2021-11-01",
            subscription:"Basic",

        },
        {
            name:"Yam",
            role:"Agent",
            last_active:"2021-11-01",
            subscription:"Basic",

        },
        {
            name:"Casava",
            role:"Club Official",
            last_active:"2021-11-01",
            subscription:"Premium",

        }
    ],
    currentPage:0,
    rowsPerPage:4,
    search:"",
    sortedKey:""
 })

 export const filterUsers=(value:string)=>{
    const {users,staticUsers, search} = usersState;
    var data = filter(value,"name",staticUsers.get());
    users.set(data);
    search.set(value);
}

export const sortUsers=(key:any)=>{
   const {sortedKey, users} = usersState;
   var asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   var data = sort(key,users.get(),asend);
   users.set(data);

}


