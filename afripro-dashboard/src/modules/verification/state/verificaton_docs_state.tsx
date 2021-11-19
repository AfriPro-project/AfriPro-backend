import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get, post } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";

export const verificationDocsState = createState({
    verificationDocs:[],
    staticVerificationDocs:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    passport:"",
    photo:"",
    status:""
 });


 export const filterVeiricationDocs=(value:string)=>{
    const {verificationDocs,staticVerificationDocs, search,currentPage} = verificationDocsState;
    let data = filter(value,"name",staticVerificationDocs.get());
    verificationDocs.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortverificationDocs=(key:any)=>{
   const {sortedKey, verificationDocs} = verificationDocsState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,verificationDocs.get(),asend);
   verificationDocs.set(data);
}

export const fetchverificationDocs=async()=>{
    let response = await get('/verification_docs');
    if(verificationDocsState.search.get().length < 1)  verificationDocsState.verificationDocs.set(response);
    verificationDocsState.staticVerificationDocs.set(response);
}


export const fetchverificationDoc=async(id:string)=>{
    try{
    const {passport,photo,status} = verificationDocsState;
        passport.set("");
        status.set("");
        photo.set("");
     preloaderState.loading.set(true);
     let res = await get('/verification_docs/'+id);
     if(Object.keys(res).length > 0){
        passport.set(res.passport);
        photo.set(res.photo);
        status.set(res.status);
     }else{
         if(status.get().length < 1){
             window.open('/verification_docs','_self');
         }
     }
     await fetchverificationDocs();

    }catch(e){
     connectionFailed(e);
    }finally{
     preloaderState.loading.set(false);
    }
 }


export const verifyverificationDoc=async(id:string)=>{
   try{
    let data ={
        'id':id
    }
    preloaderState.loading.set(true);
    await post('/verification_docs/verify',data);
    await fetchverificationDocs();
    verificationDocsState.status.set("verified");
   }catch(e){
    connectionFailed(e);
   }finally{
    preloaderState.loading.set(false);
   }
}

export const rejectverificationDoc=async(id:string)=>{
    try{
     let data ={
         'id':id
     }
     preloaderState.loading.set(true);
     await post('/verification_docs/reject',data);
     await fetchverificationDocs();
     verificationDocsState.status.set("rejected");
    }catch(e){
     connectionFailed(e);
    }finally{
     preloaderState.loading.set(false);
    }
 }


function connectionFailed(e:any){
    console.log(e);
    showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
}
