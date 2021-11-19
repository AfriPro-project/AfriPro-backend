import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get, post, uploadFile } from "../../../services/api";
import { filter, sort } from "../../../utils/globalFunctions/sort_filter_function";
import { getDateTime, validURL } from "../../events/states/events_state";

let imageData: any = null;
export const adsState=createState({
    ads:[],
    adInfo:{} as any,
    staticAds:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    title:"",
    sponsorName:"",
    adUrl:"",
    expiryDate:getDateTime(),
    rank:"0",
    image:"",
    status:"active"
});

export const filterAds=(value:string)=>{
    const {ads,staticAds, search,currentPage} = adsState;
    let data = filter(value,"sponsor_name",staticAds.get());
    ads.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortAds=(key:any)=>{
   const {sortedKey, ads} = adsState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,ads.get(),asend);
   ads.set(data);
}

export const fetchAds=async()=>{
    let response = await get('/adverts_admin');
    if(adsState.search.get().length < 1) adsState.ads.set(response);
    adsState.staticAds.set(response);
}

export const deleteAd=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/adverts_delete',data);
        showDialog("Done","Advert deleted");
        let newAds = JSON.parse(JSON.stringify(adsState.ads.get()))
        let staticAds = JSON.parse(JSON.stringify(adsState.staticAds.get()))

        let index = newAds.findIndex((opportunity:any)=>opportunity.id === id);
        let index2 = staticAds.findIndex((opportunity:any)=>opportunity.id === id);

        newAds.splice(index,1);
        staticAds.splice(index2,1);
        adsState.ads.set(newAds);
        adsState.staticAds.set(staticAds);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
 }

 export const onImageChange = (event:any) => {
    if (event.target.files && event.target.files[0]) {
      if(event.target.files[0] != null){
        const name = event.target.files[0].name;
        const lastDot = name.lastIndexOf('.');

        const ext = name.substring(lastDot + 1);
        const exts = ['png','jpg','gif','jpeg'];
        if(exts.includes(ext.toLowerCase()) === false){
            showDialog("Attention","Please choose a valid image");
            return;
        }
      }
      adsState.image.set(URL.createObjectURL(event.target.files[0]));

      imageData = event.target.files[0];
    }
}

export const addAdvert=async()=>{
    try{
     preloaderState.loading.set(true);
     const {title,sponsorName,adUrl,expiryDate,rank,search,currentPage,rowsPerPage,image,status} = adsState;

     if(title.get().trim().length < 1 || sponsorName.get().trim().length < 1 || rank.get().length < 1){
        showDialog("Attention","Please fill the form correctly");
        return;
    }

     if(!validURL(adUrl.get())){
        showDialog("Attention","Please Provid a valid url");
        return;
     }

     if(isNaN(parseInt(rank.get()))){
        showDialog("Attention","Please a valid rank");
        return;
     }

     if(Object.keys(adsState.adInfo.get()).length > 0){
         var serverFile = adsState.adInfo.get().sponsor_image!;
     }else{
        if(Date.parse(expiryDate.get().replace('T',' ')) <= Date.parse(getDateTime().replace('T',' '))){
            showDialog("Attention","Current time should lesser than Expiry Time");
            return;
        }
     }

     if(imageData != null){
         let previousFile = Object.keys(adsState.adInfo.get()).length > 0 ? adsState.adInfo.get().sponsor_image : "";
         let response = await uploadFile(imageData,previousFile);
         serverFile = response.file.path;
     }

     if(serverFile == null){
         showDialog("Attention","Please choose sponor image");
         return;
     }



     interface LooseObject {
         [key: string]: any
     }

     let data:LooseObject = {
         "title":title.get(),
         "sponsor_image":serverFile,
         "sponsor_name":sponsorName.get(),
         "expiry_date":expiryDate.get(),
         "status":status.get(),
         "ad_url":adUrl.get(),
         "rank":rank.get(),

     };

     let msg = "Event Added successfully";
     if(Object.keys(adsState.adInfo.get()).length > 0){
         data['id'] = adsState.adInfo.get().id!;
         await post('/adverts_update',data)
         msg = "Event Updated successfully";
     }else{
         await post('/adverts',data);
         await fetchAds();
         search.set("");
         currentPage.set(0);
         rowsPerPage.set(10);
         image.set("");
         expiryDate.set(getDateTime());
         adUrl.set("");
         sponsorName.set("");
         title.set("");
         rank.set("0");
         serverFile = null;
     };

     showDialog("Done",msg);
    }catch(e){
     console.log(e);
     showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
     preloaderState.loading.set(false);
    }
 }



 export const fetchAd=async(id:string)=>{
    try{
     preloaderState.loading.set(true);
     const {title,sponsorName,adInfo,adUrl,expiryDate,rank,image,status} = adsState;
     adInfo.set("");
     image.set("");
     expiryDate.set(getDateTime());
        adUrl.set("");
        sponsorName.set("");
        title.set("");
        rank.set("0");
     let res = await get(`/adverts/${id}`);
     if(Object.keys(res).length === 1){
         window.open('/ads','_self');
     }
     adInfo.set(res);
     title.set(res.title);
     expiryDate.set(getDateTime());
     adUrl.set(res.ad_url);
     sponsorName.set(res.sponsor_name);
     title.set(res.title);
     rank.set(res.rank);
     status.set(res.status);
     image.set(`${process.env.REACT_APP_BACKEND_APP_URL}${res.sponsor_image.replace('public','storage')}`);
    }catch(e){
     console.log(e);
     showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
     preloaderState.loading.set(false);
    }
 }
