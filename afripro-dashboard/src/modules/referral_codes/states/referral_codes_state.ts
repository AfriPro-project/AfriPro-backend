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
    referralCode:"",
    search:"",
    sortedKey:"",
    referalCodeId:0,
    paidUsers:[],
    normalUsers:[]
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

export const fetchReferralCode=async(id:string)=>{
    try{
        preloaderState.loading.set(true);
        let data = {
            'id':id
        }
    let response = await post('/referral_codes/show',data);
    referralCodesState.referralCode.set(response['referral_code']);
    referralCodesState.referalCodeId.set(response['id']);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}


export const fetchReferralCodeUsage=async(id:string)=>{
    try{
        preloaderState.loading.set(true);
        referralCodesState.paidUsers.set([]);
        referralCodesState.normalUsers.set([]);
        referralCodesState.referralCode.set("");
        let data = {
            'id':id
        }
    let response = await post('/referral_codes/usageCounts',data);
    referralCodesState.paidUsers.set(response.data.paidUsers);
    referralCodesState.normalUsers.set(response.data.normalUsers);
    referralCodesState.referralCode.set(response.referral_code);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}

export const addReferralCode=async()=>{
    try{
        preloaderState.loading.set(true);
        interface LooseObject {
            [key: string]: any
        }

        let data:LooseObject ={
            'referral_code':referralCodesState.referralCode.get()
        };
        let msg = "Referral Code added";
        if(referralCodesState.referalCodeId.get() > 0){
            data['id'] = referralCodesState.referalCodeId.get();
            var response = await post('/referral_codes/updateCode',data);
            msg = "Referral Code updated";
        }else{
            response = await post('/referral_codes/addCustom',data);
            referralCodesState.search.set("");
            referralCodesState.referralCode.set("");
        }
        if(response['status'] === 'error'){
            showDialog("Attention",response['message']);
            return;
        }else{
            showDialog("Success",msg);
        }

        await fetchReferralCodes();
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}

export const deleReferralCode=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/delete_referral_code',data);
        showDialog("Done","Referral Code deleted");
        await fetchReferralCodes();
        window.open('/referral_codes','_self');
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}
