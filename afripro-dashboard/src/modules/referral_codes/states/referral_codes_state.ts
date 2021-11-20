import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get, post } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";
export const referralCodesState = createState({
    referralCodes:[],
    referralCodeInfo:{} as any,
    staticReferralCodes:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:""
 })


 export const filterCodes=(value:string)=>{
    const {referralCodes,staticReferralCodes, search,currentPage} = referralCodesState;
    let data = filter(value,"name",staticReferralCodes.get());
    referralCodes.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortCodes=(key:any)=>{
   const {sortedKey, referralCodes} = referralCodesState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,referralCodes.get(),asend);
   referralCodes.set(data);
}

export const fetchReferralCodes=async()=>{
    let response = await get('/referral_codes');
    if(referralCodesState.search.get().length < 1) referralCodesState.referralCodes.set(response);
    referralCodesState.staticReferralCodes.set(response);
}



export const deleReferralCode=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/delete_referral_code',data);
        showDialog("Done","Referral Code deleted");
        let newReferralCodes = JSON.parse(JSON.stringify(referralCodesState.referralCodes.get()))
        let staticReferralCodes = JSON.parse(JSON.stringify(referralCodesState.staticReferralCodes.get()))

        let index = newReferralCodes.findIndex((opportunity:any)=>opportunity.id === id);
        let index2 = staticReferralCodes.findIndex((opportunity:any)=>opportunity.id === id);

        newReferralCodes.splice(index,1);
        staticReferralCodes.splice(index2,1);
        referralCodesState.referralCodes.set(newReferralCodes);
        referralCodesState.staticReferralCodes.set(staticReferralCodes);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}
