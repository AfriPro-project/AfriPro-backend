import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get, post } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";

export const scholarsState = createState({
    scholars:[],
    staticScholars:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
 })


 export const fetchScholars=async ()=>{
    const {scholars,staticScholars} = scholarsState;
  let response = await get('/scholars');
  staticScholars.set(response);
  if(scholarsState.search.get().length < 1) scholars.set(response);
}

 export const filterscholars=(value:string)=>{
    const {scholars,staticScholars, search,currentPage} = scholarsState;
    let data = filter(value,"name",staticScholars.get());
    scholars.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortscholars=(key:any)=>{
   const {sortedKey, scholars} = scholarsState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,scholars.get(),asend);
   scholars.set(data);
}


export const deleteScholar=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/scholars/delete',data);
        showDialog("Done","Scholar deleted");
        let newScholars = JSON.parse(JSON.stringify(scholarsState.scholars.get()))
        let staticScholars = JSON.parse(JSON.stringify(scholarsState.staticScholars.get()))

        let index = newScholars.findIndex((opportunity:any)=>opportunity.id === id);
        let index2 = staticScholars.findIndex((opportunity:any)=>opportunity.id === id);

        newScholars.splice(index,1);
        staticScholars.splice(index2,1);
        scholarsState.scholars.set(newScholars);
        scholarsState.staticScholars.set(staticScholars);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}
