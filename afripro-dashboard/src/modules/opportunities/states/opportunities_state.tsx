import { createState } from "@hookstate/core";
import { showDialog } from "../../../components/dialog/dialog_state";
import preloaderState from "../../../components/preloader/preloader_state";
import { get,post,uploadFile} from "../../../services/api";
import {sort,filter} from '../../../utils/globalFunctions/sort_filter_function';


let imageData: any = null;
export const opportunitiesState = createState({
    opportunities:[],
    opportunityInfo:{} as any,
    staticOpporunities:[],
    currentPage:0,
    rowsPerPage:10,
    search:"",
    sortedKey:"",
    firstName:"",
    lastName:"",
    emailAddress:"",
    phoneNumber:"",
    title:"",
    description:"",
    image:"",
    submissions:[],
 })

 export const filterOpportunities=(value:string)=>{
    const {opportunities,staticOpporunities, search,currentPage} = opportunitiesState;
    let data = filter(value,"title",staticOpporunities.get());
    opportunities.set(data);
    search.set(value);
    currentPage.set(0);
}

export const sortOpportunities=(key:any)=>{
   const {sortedKey, opportunities} = opportunitiesState;
   let asend  = true;
   if(sortedKey.get() === key){
       asend = false;
       sortedKey.set("");
   }else{
    sortedKey.set(key);
   }
   let data = sort(key,opportunities.get(),asend);
   opportunities.set(data);
}

export const fetchOpportunities=async()=>{
    let response = await get('/opportunities/admin');
    if(opportunitiesState.search.get().length < 1) opportunitiesState.opportunities.set(response);
    opportunitiesState.staticOpporunities.set(response);
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
      opportunitiesState.image.set(URL.createObjectURL(event.target.files[0]));

      imageData = event.target.files[0];

    }
}


export const addOpportunity=async()=>{
   try{
    preloaderState.loading.set(true);
    const {title,description} = opportunitiesState;

    if(title.get().trim().length < 1 || description.get().trim().length < 30){
        showDialog("Attention","Please fill the form correctly");
        return;
    }


    if(Object.keys(opportunitiesState.opportunityInfo.get()).length > 0){
        var serverFile = opportunitiesState.opportunityInfo.get().image!;
    }

    if(imageData != null){
        let previousFile = Object.keys(opportunitiesState.opportunityInfo.get()).length > 0 ? opportunitiesState.opportunityInfo.get().image : "";
        let response = await uploadFile(imageData,previousFile);
        serverFile = response.file.path;
    }

    if(serverFile == null){
        showDialog("Attention","Please choose an image");
        return;
    }



    interface LooseObject {
        [key: string]: any
    }

    let data:LooseObject = {
        "title":title.get(),
        "description":description.get(),
        "image": serverFile,
        'status':"open"
    };

    let msg = "Opportunity Added successfully";
    if(Object.keys(opportunitiesState.opportunityInfo.get()).length > 0){
        data['id'] = opportunitiesState.opportunityInfo.get().id!;
        await post('/update_opportunity',data)
        msg = "Opportunity Updated successfully";
    }else{
        await post('/save_opportunity',data);
        await fetchOpportunities();
        opportunitiesState.search.set("");
        opportunitiesState.currentPage.set(0);
        opportunitiesState.rowsPerPage.set(10);
        opportunitiesState.image.set("");
        title.set("");
        description.set("");
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

export const deleteOpportunity=async(id:string)=>{
    try{
        let data ={
            'id':id
        };
        preloaderState.loading.set(true);
        await post('/delete_opportunity',data);
        showDialog("Done","Opportunity deleted");
        let newOpportunities = JSON.parse(JSON.stringify(opportunitiesState.opportunities.get()))
        let staticOpporunities = JSON.parse(JSON.stringify(opportunitiesState.staticOpporunities.get()))

        let index = newOpportunities.findIndex((opportunity:any)=>opportunity.id === id);
        let index2 = staticOpporunities.findIndex((opportunity:any)=>opportunity.id === id);

        newOpportunities.splice(index,1);
        staticOpporunities.splice(index2,1);
        opportunitiesState.opportunities.set(newOpportunities);
        opportunitiesState.staticOpporunities.set(staticOpporunities);
    }catch(e){
        console.log(e);
        showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
    }finally{
        preloaderState.loading.set(false);
    }
}


export const fetchOpportunity=async(id:string)=>{
   try{
    preloaderState.loading.set(true);
    const {opportunityInfo, title, description,image,submissions}= opportunitiesState;
    opportunityInfo.set("");
    title.set("");
    description.set("");
    image.set("");
    submissions.set([]);
    let res = await get(`/opportunities/${id}/1`);
    opportunityInfo.set(res);
    title.set(res.title);
    description.set(res.description);
    submissions.set(res.submissions);
    image.set(`${process.env.REACT_APP_BACKEND_APP_URL}${res.image.replace('public','storage')}`);
   }catch(e){
    console.log(e);
    showDialog("Attention","Opps, we are having a problem connecting to our services at the moment please try again later");
   }finally{
    preloaderState.loading.set(false);
   }
}
